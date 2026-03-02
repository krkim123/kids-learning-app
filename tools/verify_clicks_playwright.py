import json
import os
import sys
import threading
from datetime import datetime
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path

from playwright.sync_api import TimeoutError as PlaywrightTimeoutError
from playwright.sync_api import sync_playwright


ROOT = Path(__file__).resolve().parents[1]
PORT = 8765
URL = f"http://127.0.0.1:{PORT}/index.html"


class QuietHandler(SimpleHTTPRequestHandler):
    def log_message(self, format, *args):
        return


def active_screen(page):
    try:
        return page.eval_on_selector(".screen.active", "el => el.id")
    except Exception:
        return None


def semantic_state(page):
    try:
        return page.evaluate(
            """
            () => {
              const app = window.App || {};
              const game = window.Game || {};
              const titleNode = document.querySelector('#screen-game-select .play-hub-title, #screen-game-select .section-title, #screen-game-select h2, #screen-game-select h3');
              return {
                activeScreen: document.querySelector('.screen.active')?.id || null,
                appScreen: app.currentScreen || null,
                currentCategory: game.currentCategory || null,
                currentGame: game.currentGame || null,
                quizGameType: game.quizGameType || null,
                mathQuestionMode: game.mathQuestionMode || null,
                brainTestMode: game.brainTestMode || null,
                gameSelectCount: document.querySelectorAll('#screen-game-select .game-mode-card').length || 0,
                githubPackCount: document.querySelectorAll('#screen-game-select .github-pack-card').length || 0,
                gameSelectTitle: (titleNode?.innerText || titleNode?.textContent || '').trim().replace(/\\s+/g, ' '),
              };
            }
            """
        )
    except Exception:
        return {
            "activeScreen": None,
            "appScreen": None,
            "currentCategory": None,
            "currentGame": None,
            "quizGameType": None,
            "mathQuestionMode": None,
            "brainTestMode": None,
            "gameSelectCount": 0,
            "githubPackCount": 0,
            "gameSelectTitle": "",
        }


def short_text(text):
    return " ".join((text or "").split())[:120]


def wait_for_screen(page, screen_id, timeout_ms=5000):
    page.wait_for_function(
        """
        (id) => {
          const el = document.getElementById(id);
          const byClass = !!(el && el.classList.contains("active"));
          const appId = id.startsWith("screen-") ? id.slice(7) : id;
          const byApp = !!(window.App && App.currentScreen === appId);
          return byClass || byApp;
        }
        """,
        arg=screen_id,
        timeout=timeout_ms,
    )


def js_eval(page, script):
    try:
        page.evaluate(script)
        return True, ""
    except Exception as exc:
        return False, short_text(str(exc))


def count_cards(page, selector):
    try:
        return page.locator(selector).count()
    except Exception:
        return 0


def wait_for_cards(page, selector, timeout_ms=6000):
    page.wait_for_function(
        "(sel) => document.querySelectorAll(sel).length > 0",
        arg=selector,
        timeout=timeout_ms,
    )


def ensure_home(page):
    page.goto(URL, wait_until="domcontentloaded")
    page.wait_for_timeout(1800)

    # Splash -> profile/home
    for _ in range(12):
        scr = active_screen(page)
        if scr in ("screen-home", "screen-profile"):
            break
        page.wait_for_timeout(400)

    scr = active_screen(page)
    if scr == "screen-profile":
        existing = page.locator("#screen-profile .profile-card:not(.profile-add-card)")
        if existing.count() > 0:
            existing.first.click(timeout=4000)
        else:
            page.fill("#new-profile-name", "QA")
            if page.locator(".age-btn[data-age='child']").count() > 0:
                page.locator(".age-btn[data-age='child']").first.click()
            if page.locator(".avatar-btn").count() > 0:
                page.locator(".avatar-btn").first.click()
            if page.locator(".theme-btn").count() > 0:
                page.locator(".theme-btn").first.click()
            page.locator(".profile-form-actions .btn-primary").first.click(timeout=4000)

    wait_for_screen(page, "screen-home", timeout_ms=10000)


def ensure_play_hub(page):
    scripts = [
        "window.App && App.tabPlay && App.tabPlay();",
        "window.App && App.navigate && App.navigate('game-select');",
        "window.Game && Game.showSelection && Game.showSelection('hangul');",
    ]
    selector = "#screen-game-select .game-mode-card"

    for script in scripts:
        ok, _ = js_eval(page, script)
        if not ok:
            continue
        page.wait_for_timeout(600)
        try:
            wait_for_cards(page, selector, timeout_ms=5000)
            return True, ""
        except PlaywrightTimeoutError:
            pass

    return False, "could not open play hub (screen-game-select)"


def ensure_category(page, category_id):
    scripts = [
        f"window.Game && Game.showSelection && Game.showSelection('{category_id}');",
        (
            "window.App && App.tabPlay && App.tabPlay(); "
            f"window.Game && Game.showSelection && Game.showSelection('{category_id}');"
        ),
    ]
    selector = "#screen-game-select .game-mode-card"

    for script in scripts:
        ok, _ = js_eval(page, script)
        if not ok:
            continue
        page.wait_for_timeout(600)
        try:
            wait_for_cards(page, selector, timeout_ms=5000)
            return True, ""
        except PlaywrightTimeoutError:
            pass

    return False, f"could not open category view: {category_id}"


def run_group(page, group_name, selector, restore_js, error_log, results, restore_screen_id=None):
    try:
        targets = page.eval_on_selector_all(
            selector,
            """
            (els) => els.map((el, idx) => ({
              idx,
              text: ((el.innerText || el.textContent || "").trim().replace(/\\s+/g, " ").slice(0, 120)),
              onclick: el.getAttribute("onclick") || ""
            }))
            """,
        )
    except Exception:
        targets = []

    if not targets:
        results.append(
            {
                "group": group_name,
                "label": "<group-load>",
                "status": "fail",
                "reason": f"no targets found for selector: {selector}",
                "screen_before": active_screen(page),
                "screen_after": active_screen(page),
            }
        )
        return

    for idx, target in enumerate(targets):
        ok, msg = js_eval(page, restore_js)
        if ok:
            page.wait_for_timeout(350)
            if restore_screen_id:
                try:
                    wait_for_screen(page, restore_screen_id, timeout_ms=4000)
                except PlaywrightTimeoutError:
                    pass
            if ".game-mode-card" in selector:
                try:
                    wait_for_cards(page, selector, timeout_ms=2500)
                except PlaywrightTimeoutError:
                    pass
        else:
            results.append(
                {
                    "group": group_name,
                    "label": f"{group_name}#{idx + 1} <restore-pre>",
                    "status": "fail",
                    "reason": f"restore failed: {msg}",
                    "screen_before": active_screen(page),
                    "screen_after": active_screen(page),
                }
            )

        label = short_text(target.get("text")) or f"{group_name}#{idx + 1}"
        onclick = (target.get("onclick") or "").strip()

        before_errors = len(error_log)
        before_state = semantic_state(page)
        before_screen = before_state.get("activeScreen") or active_screen(page)
        status = "pass"
        reason = ""

        try:
            click_error = None
            try:
                loc = page.locator(selector).nth(idx)
                loc.click(timeout=5000)
            except Exception as click_exc:
                click_error = click_exc
                if onclick:
                    err = page.evaluate(
                        """
                        (code) => {
                          try {
                            (new Function(code))();
                            return "";
                          } catch (e) {
                            return String(e);
                          }
                        }
                        """,
                        onclick,
                    )
                    if err:
                        raise RuntimeError(err)
                else:
                    raise click_error
            page.wait_for_timeout(800)
        except Exception as exc:
            status = "fail"
            reason = f"click exception: {short_text(str(exc))}"

        new_errors = error_log[before_errors:]
        if new_errors and status == "pass":
            status = "fail"
            reason = f"runtime error: {short_text(new_errors[0]['message'])}"

        after_state = semantic_state(page)
        after_screen = after_state.get("activeScreen") or active_screen(page)
        if status == "pass":
            same_screen = before_screen == after_screen
            same_semantic = (
                before_state.get("appScreen") == after_state.get("appScreen")
                and before_state.get("currentCategory") == after_state.get("currentCategory")
                and before_state.get("currentGame") == after_state.get("currentGame")
                and before_state.get("quizGameType") == after_state.get("quizGameType")
                and before_state.get("mathQuestionMode") == after_state.get("mathQuestionMode")
                and before_state.get("brainTestMode") == after_state.get("brainTestMode")
            )
            same_game_select = (
                before_state.get("gameSelectCount") == after_state.get("gameSelectCount")
                and before_state.get("githubPackCount") == after_state.get("githubPackCount")
                and before_state.get("gameSelectTitle") == after_state.get("gameSelectTitle")
            )

            if same_screen and same_semantic and same_game_select:
                status = "warn"
                reason = "screen unchanged"

        results.append(
            {
                "group": group_name,
                "label": label,
                "status": status,
                "reason": reason,
                "screen_before": before_screen,
                "screen_after": after_screen,
            }
        )

        # No post-restore here. Each step restores pre-click to avoid state bleed.


def build_report(all_results, error_log, started_at, fatal_error):
    total = len(all_results)
    failed = [r for r in all_results if r["status"] == "fail"]
    warned = [r for r in all_results if r["status"] == "warn"]
    passed = [r for r in all_results if r["status"] == "pass"]

    return {
        "started_at": started_at,
        "finished_at": datetime.now().isoformat(),
        "url": URL,
        "summary": {
            "total": total,
            "pass": len(passed),
            "warn": len(warned),
            "fail": len(failed),
            "runtime_errors": len(error_log),
        },
        "fatal_error": fatal_error,
        "failed_items": failed,
        "warn_items": warned,
        "all_results": all_results,
        "runtime_errors": error_log,
    }


def main():
    os.chdir(ROOT)

    server = ThreadingHTTPServer(("127.0.0.1", PORT), QuietHandler)
    thread = threading.Thread(target=server.serve_forever, daemon=True)
    thread.start()

    all_results = []
    error_log = []
    started_at = datetime.now().isoformat()
    fatal_error = ""

    try:
        with sync_playwright() as p:
            browser = p.chromium.launch(headless=True)
            context = browser.new_context(viewport={"width": 390, "height": 844})
            page = context.new_page()

            page.on("pageerror", lambda e: error_log.append({"type": "pageerror", "message": str(e)}))
            page.on(
                "console",
                lambda msg: error_log.append({"type": "console.error", "message": msg.text})
                if msg.type == "error"
                else None,
            )

            ensure_home(page)

            # Home quick-play cards
            run_group(
                page,
                "home-quick-play",
                "#screen-home .quick-play-card",
                "window.App && App.tabHome && App.tabHome();",
                error_log,
                all_results,
                "screen-home",
            )

            # Play hub cards
            ok, reason = ensure_play_hub(page)
            if not ok:
                all_results.append(
                    {
                        "group": "play-hub-cards",
                        "label": "<setup>",
                        "status": "fail",
                        "reason": reason,
                        "screen_before": active_screen(page),
                        "screen_after": active_screen(page),
                    }
                )
            else:
                run_group(
                    page,
                    "play-hub-cards",
                    "#screen-game-select .game-mode-card",
                    "window.App && App.navigate && App.navigate('game-select');",
                    error_log,
                    all_results,
                    "screen-game-select",
                )

            # Category specific game cards
            for category_id in ("hangul", "english", "number", "math"):
                ok, reason = ensure_category(page, category_id)
                if not ok:
                    all_results.append(
                        {
                            "group": f"category-{category_id}",
                            "label": "<setup>",
                            "status": "fail",
                            "reason": reason,
                            "screen_before": active_screen(page),
                            "screen_after": active_screen(page),
                        }
                    )
                    continue

                run_group(
                    page,
                    f"category-{category_id}",
                    "#screen-game-select .game-mode-card",
                    f"window.App && App.navigate && App.navigate('game-select'); window.Game && Game.showSelection('{category_id}');",
                    error_log,
                    all_results,
                    "screen-game-select",
                )

            context.close()
            browser.close()
    except Exception as exc:
        fatal_error = short_text(str(exc))
        error_log.append({"type": "fatal", "message": str(exc)})
    finally:
        server.shutdown()
        server.server_close()

    report = build_report(all_results, error_log, started_at, fatal_error)

    reports_dir = ROOT / "docs" / "reports"
    reports_dir.mkdir(parents=True, exist_ok=True)
    report_path = reports_dir / f"{datetime.now().strftime('%Y-%m-%d')}-click-verify-report.json"
    report_path.write_text(json.dumps(report, ensure_ascii=False, indent=2), encoding="utf-8")

    print("CLICK VERIFY SUMMARY")
    print(json.dumps(report["summary"], ensure_ascii=False))
    print(f"Report: {report_path}")

    if report.get("fatal_error"):
        print(f"FATAL: {report['fatal_error']}")

    failed = report["failed_items"]
    if failed:
        print("FAILED ITEMS")
        for item in failed:
            safe_label = str(item["label"]).encode("ascii", "backslashreplace").decode("ascii")
            safe_reason = str(item["reason"]).encode("ascii", "backslashreplace").decode("ascii")
            print(f"- [{item['group']}] {safe_label} :: {safe_reason}")

    if report.get("fatal_error") or failed:
        sys.exit(1)


if __name__ == "__main__":
    main()
