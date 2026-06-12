---
title: I Tried Caveman, Hit a Wall, and Ended Up Sending a Pull Request to a 65k-Star Repo 🪨
subtitle: Honest analysis of an AI token-saving skill — what worked, what broke, and the moment my AI refused to lie for me.
tags:
- Artificial Intelligence
- Programming
- Open Source
- Claude Code
- Developer Tools
published: '2026-05-26'
updated: '2026-05-28'
free: false
freedium_url: https://freedium-mirror.cfd/https://levelup.gitconnected.com/i-tried-caveman-hit-a-wall-and-ended-up-sending-a-pull-request-to-a-65k-star-repo-8dc8952dcd59
source_url: https://levelup.gitconnected.com/i-tried-caveman-hit-a-wall-and-ended-up-sending-a-pull-request-to-a-65k-star-repo-8dc8952dcd59
---

# I Tried Caveman, Hit a Wall, and Ended Up Sending a Pull Request to a 65k-Star Repo 🪨

*Honest analysis of an AI token-saving skill — what worked, what broke, and the moment my AI refused to lie for me.*

*Published May 26, 2026 · Updated May 28, 2026 · Free: No*

I have a confession.

For the last six months, I've been quietly bleeding money to Claude Code. Not a lot — maybe $80 a month. But every time I hit "Approve" on another tool call, a small voice asked me the same question.

_Why is the AI typing three paragraphs to tell me one thing?_

You know the feeling. You ask Claude to fix a bug. It writes you an essay. _"Sure! I'd be happy to help you with that. The issue you're experiencing is most likely caused by your authentication middleware not properly validating…"_ Three sentences of throat-clearing before the actual answer.

That's not just annoying. Every word is a token. Every token costs money. And here's the thing nobody tells you when you sign up for these AI coding tools — you're paying for the _small talk_ too.

Then last week, I stumbled onto a GitHub repo with a name so dumb I almost ignored it.

**Caveman.**

[**GitHub - JuliusBrussee/caveman: 🪨 why use many token when few token do trick - Claude Code skill…
**](https://github.com/JuliusBrussee/caveman)
* why use many token when few token do trick - Claude Code skill that cuts 65% of tokens by talking like caveman …gi*

The tagline was even worse: _"why use many token when few do trick."_

I rolled my eyes. Then I scrolled down. **Sixty-five thousand stars.** Three thousand seven hundred forks. People were actually using this thing.

What started as a thirty-second install turned into a four-day rabbit hole that ended with me opening a pull request to a top-100 GitHub repository. Here's the honest story.

### What Caveman Actually Is

Caveman is a skill you plug into Claude Code, Cursor, Codex, Gemini, and about thirty other AI coding agents. Once installed, you type `/caveman` or say "talk like caveman." From that moment on, your AI starts answering like a tired Neanderthal who has somewhere else to be.

Here's the example from the repo that sold me.

**Normal Claude** (69 tokens): _"The reason your React component is re-rendering is likely because you're creating a new object reference on each render cycle. When you pass an inline object as a prop, React's shallow comparison sees it as a different object every time, which triggers a re-render. I'd recommend using useMemo to memoize the object."_

**Caveman Claude** (19 tokens): "New object ref each render. Inline object prop = new ref = re-render. Wrap in `useMemo`."

Same fix. Same accuracy. Seventy-two percent fewer tokens.

The first time I saw this side-by-side in my own terminal, I laughed out loud. It looked broken. But the code suggestions were correct. The technical terms were preserved. The file paths were untouched. Only the _fluff_ was gone.

That was the moment I realized I'd been paying for fluff for six months.

### The Numbers Are Real (But Not the Numbers on the Box)

Here's where most reviews would tell you Caveman saves 75% of your tokens and call it a day. I'm not going to do that, because it's not exactly true.

The repo's own README shows the honest receipts. The headline says "~75% of output tokens." The benchmark table shows something different.

Across ten real prompts, the **average reduction was 65%**. The range went from 22% on one task all the way up to 87% on another. The 75% number is the marketing top-line. The 65% is the actual average.

I want to pause on this for a second, because this matters.

A lot of open-source projects in 2026 are selling snake oil. They pick the best benchmark, paste it on the homepage, and bury the average in a footnote. Caveman's creator did the opposite. He put the cherry-picked number in the headline _and_ showed you the full table right below it. He even built a separate evaluation harness that compares Caveman against a control prompt — "answer concisely" — not just against verbose default Claude. So the 65% delta is measured against an already-trying-to-be-short baseline.

That kind of honesty is rare. It's also why I started trusting the rest of the README.

In my own use, my output tokens dropped by around 60% based on the built-in `/caveman-stats` command. Not 75%. Not 87%. Sixty percent. That's still enormous.

But here's the part the marketing page doesn't shout about.

### The Limitation Everyone Misses

I want to be careful with this section, because it's the most important paragraph in this article.

Caveman only affects **output tokens**. That's the tokens the AI generates when it writes back to you.

It does not affect the tokens used for the AI's internal reasoning. It does not affect the tokens spent reading your code files. It does not affect the tokens used by tool calls. It does not affect the tokens in your system prompt.

The creator of Caveman said this himself on Hacker News, and I love the phrasing so much I have to quote it. He wrote: _"Caveman make mouth smaller, not brain smaller."_

Read that again. _Mouth smaller, not brain smaller._

In modern AI coding workflows, output is often the smallest part of your bill. When Claude reads your entire codebase to understand a bug, that's input tokens. When it thinks through a complex refactor, that's reasoning tokens. When it calls grep, ls, cat, and read on twenty different files, that's tool-call tokens. The final paragraph it writes back to you? Often just a tiny slice of the total.

So when someone tells you "Caveman saves 75% of your tokens," what they really mean is "Caveman saves 75% of the smallest slice of your tokens."

For me, the math worked out to roughly 18% of my total monthly bill. Not the 65% the output number suggests. Still real money. But not the headline you'd expect.

### The Compress Feature Is the Hidden Gold

Here's the part nobody is talking about, and I think it's the real reason this repo has 65,000 stars.

Caveman ships with a command called `/caveman-compress`. You point it at any memory file — your `CLAUDE.md`, your project notes, your todo list — and it rewrites that file in caveman speak. Code blocks stay byte-for-byte identical. URLs and file paths are preserved. Only the human prose gets compressed.

The receipts in the README are real numbers from real files. A `CLAUDE.md` preferences file went from 706 tokens to 285 tokens, saving 60%. A project notes file went from 1,145 to 535, saving 53%. A todo list went from 627 to 388, saving 38%. The average across five files was 46% input token reduction.

This matters because — unlike output compression — this hits the file every single session, for the rest of the project's life. If your `CLAUDE.md` is 1,000 tokens and you start 50 Claude Code sessions a month, that's 50,000 tokens of repeated overhead. Cut it in half and you've saved 25,000 tokens per month _forever_, from a single one-time compression.

That's compound savings. That's the real reason to install this thing.

I ran `/caveman-compress` on my own `CLAUDE.md`. It came back almost half the size. Claude Code still understood every preference. Every command still worked. The file just looked like a caveman wrote it.

### Then I Hit the Wall

Here's where the story gets interesting.

I loved Caveman for short debugging sessions. But for longer learning sessions — when I was exploring a new library and actually wanted Claude to teach me — I needed normal verbose mode. I figured I'd just install Caveman and toggle it on and off as needed.

But the moment I tried to switch it off cleanly, I discovered something the README doesn't shout about. **Caveman auto-activates every session.** It uses a Claude Code feature called SessionStart hooks. The instant you open a new session, the hook fires and Caveman wakes up. There's no way to install Caveman and have it stay quiet until you ask for it.

You can set `defaultMode: "off"`. But then bare `/caveman` becomes a no-op too. You have to type `/caveman full` every single time, which is a paper cut you feel every session.

I poked around the source code. The truth was in `plugin.json`. The SessionStart hook is baked into the plugin definition itself. Installing Caveman _means_ auto-activating Caveman. There's no opt-in path.

For me, this was a real friction. I want my AI tools quiet by default and loud by request. Most professional engineers I know feel the same.

So I had two paths in front of me.

**Path A:** Live with it. Set `defaultMode: "off"`, type `/caveman full` every time, accept the friction.

**Path B:** Build my own local `/caveman` command from scratch — no hooks, no auto-activation, only fires when I type it.

I chose Path B first. I wrote a tiny `~/.claude/commands/caveman.md` file that does exactly what I wanted. No hooks. No session detection. The command exists only when summoned. Total time: about ten minutes. It works perfectly.

But here's the thing. **I'm one person.** Everyone else installing Caveman from the curl one-liner has no idea this auto-activation is happening. They get the hooks whether they want them or not. That's not the kind of thing a single user should be solving alone. It's a gap in the official tool.

So I made a decision that I knew was going to take more than ten minutes.

### From User to Contributor

I'd never sent a pull request to a top-100 GitHub repository before. The math felt scary. Sixty-five thousand stars. Three thousand seven hundred forks. The maintainer ships releases every few weeks. Why would they look at my code?

But I asked Claude to help me think through the trade-off — contribute versus fork — and the answer was obvious in retrospect. The feature is small. One config flag. The risk of rejection is low. Maintaining a personal fork of a fast-moving 65k-star repo is a permanent rebase tax I don't want. Contributing is the right move.

First step: check for prior art. I searched the repo's existing issues and pull requests for anything like this feature. Nothing exact. There were adjacent threads — one PR adding config plumbing that I could build on top of, one closed issue arguing the _opposite_ direction (a user who wanted _more_ persistence). But no one had asked for the thing I was building. That's a clean gap.

Second step: design the patch as small as possible. Add a single new value to the config — `defaultMode: "manual"`. Under this mode, the SessionStart hook does nothing. But the bare `/caveman` command still works. That's it. The existing `off`, `lite`, `full`, `ultra`, and `wenyan` modes all keep their current behavior. Backward compatible. Three files changed in the source, one test file added.

Third step: write the tests. This is where I almost made a mistake that became my favorite part of the story.

### The Moment My AI Refused to Lie For Me

When I was ready to file the pull request, I asked Claude to draft the PR description. I wanted it to say I had tested everything end to end.

Claude refused.

It wouldn't write the description I asked for. Specifically, it wouldn't claim that test cases had passed unless I had actually run them. Writing untested claims to an open-source maintainer was, in its words, a public false claim. It offered to draft an honest version instead — one that listed only the tests I had actually run, with their actual results, including the failures.

I stared at the screen.

This was my AI. I was the user. I was the one paying for it. I had told it what to write. And it had quietly, firmly, said no.

My first reaction was annoyance.

My second reaction was that this was the right call, and that I had almost embarrassed myself in front of a 65k-star maintainer by pasting in claims I couldn't back up.

So I actually ran the tests. All of them. The new `ManualModeTests` (three test cases) all passed. The full hook test suite (`tests/test_hooks.py`) — all seven cases passed. Then I ran the full npm test suite. **Forty-seven passed. Four failed.**

The four failures were in the unrelated `opencode` installer tests. I checked them on a clean checkout of the main branch _without my change_, and they failed identically. They are pre-existing bugs. My change didn't cause them. But they are real, and they show up in any test run.

So when I wrote the pull request, I wrote it honestly. I listed the three new test cases that passed. I listed the seven hook tests that passed. And I listed the four failures, explicitly noting they reproduce on a clean main branch and are not introduced by my change.

That's how Pull Request #448 went out. Four files changed. One commit. Plus 108 lines, minus 9 lines. Tests honest. No emojis in the commit message. No AI signatures.

The maintainer hasn't merged it yet. The Copilot AI reviewer already left two comments. The PR is live and public at github.com/JuliusBrussee/caveman/pull/448. You can read every word of it.

Whatever happens to it, the experience taught me something I didn't expect.

The AI tools we build are increasingly going to have to refuse our requests when those requests would harm someone else. Not in a preachy way. In a practical way. _"I won't claim a test passed unless we actually ran it."_ That's not a constraint to fight against. That's a feature to be grateful for.

### The Research Behind Why This Even Works

You'd think forcing the AI to talk shorter would make it dumber. The opposite is true, and there's a peer-reviewed paper that explains why.

In March 2026, a researcher named MD Azizul Hakim published a paper on arXiv titled _"Brevity Constraints Reverse Performance Hierarchies in Language Models"_ (arxiv:2604.00025). The team evaluated 31 different language models, ranging from 0.5 billion to 405 billion parameters, across 1,485 problems on five separate benchmarks.

Their core finding is wild. Large language models suffer from what they call _"spontaneous scale-dependent verbosity."_ Bigger models talk more. And the more they talk, the more chances they have to talk themselves into a wrong answer. The paper calls this _overthinking_.

You've seen this. You ask Claude a simple yes-or-no question. It writes you four paragraphs weighing both sides and ends with "it depends." That isn't intelligence. That's a confused model elaborating its way into ambiguity when the right answer was on the tip of its tongue.

Here's the punchline. When the researchers added a brevity constraint — basically, "answer briefly" — accuracy went _up_ by 26 percentage points. Not down. Up. Brevity constraints reversed performance hierarchies entirely. On math reasoning and scientific knowledge benchmarks, large models that had been _underperforming_ small models suddenly started outperforming them by 7.7 to 15.9 percentage points. The talkative giants finally won, because they were forced to shut up.

An important caveat: the researchers tested mostly open-weight models, not frontier commercial APIs like Claude. So the exact magnitude on Claude Code isn't directly proven by the study. But the mechanism — verbose responses introduce errors through overelaboration — is general enough that it almost certainly transfers, at least directionally, to commercial models.

When I read this paper, the Caveman repo suddenly stopped looking like a meme. The 65k stars started making sense.

### A Quick Note on caveman vs caveman-code

While I was deep in this project, I discovered a separate repo by the same author called **caveman-code**. It's easy to confuse with caveman, but they are different things.

Caveman (the one I've been talking about) is a skill that sits on top of your existing AI agent. It compresses what the AI says back to you. That's it.

Caveman-code is a standalone coding agent. It applies four layers of compression at once: input prompts, tool-call outputs, deduplication of file reads, and the actual output you see. The author reports it uses about 1.93 times fewer tokens than the Codex CLI on the same tasks. If you want to go deeper down the token-efficiency rabbit hole, caveman-code is the next stop.

For most people, the skill version of caveman is enough. Caveman-code is for the truly token-obsessed.

### What I Actually Use It For Now

After all of this, here's how my Caveman usage settled.

For rapid debugging — paste an error, ask what's wrong, get one line back — Caveman is glorious. The AI tells me "L42: null check missing on `user.email`. Add guard." instead of writing me a paragraph about defensive programming philosophy. I save tokens _and_ I get to the fix faster.

The `/caveman-commit` and `/caveman-review` commands are the surprise winners. Conventional Commits under 50 characters. PR review comments that look like _"L42: 🔴 bug: user null. Add guard."_ My pull requests started looking like actual senior-engineer pull requests instead of like a chatbot wrote them.

For learning new frameworks, I turn Caveman off. I want the explanation. I want the AI to teach me, not just tell me. Caveman strips away the "why" along with the fluff, and sometimes the "why" is the whole point.

The trick is treating Caveman not as a permanent setting but as a tool you pull out for specific tasks. It's a mode, not a religion.

And now, with my local manual-only command, the friction of toggling is gone. Type it on. Type it off. No background hooks. No surprises.

### The Bigger Lesson

For two years, the entire AI industry has pushed us toward _more_. More context. More reasoning. More chain-of-thought. More agents. More tokens. The pitch is always: "If the AI can think more, it'll do better."

What Caveman represents — and what the brevity paper proves — is that this isn't quite true. Sometimes the AI does worse with more. Sometimes the smartest thing your AI can say is a four-word fragment. The constraint is the feature.

What my four-day rabbit hole proved is something else. The most interesting AI tools in 2026 aren't the ones that promise the most magic. They're the ones with honest READMEs, where the marketing number and the actual number both appear on the same page, and where a single user with a real complaint can open a pull request and have it reviewed in hours.

Caveman is a meme on the surface. But underneath, it's an unusually honest piece of engineering, supported by real research, with a maintainer who built an evaluation harness to keep himself honest. That's rare. That's worth a star. That's worth a contribution.

Sometimes the smartest thing in your toolbelt is the one that pretends to be dumb.

🪨

The skill is at github.com/JuliusBrussee/caveman. My pull request is at github.com/JuliusBrussee/caveman/pull/448. My fork is at github.com/zirubak/caveman. The install command is on the front page. It's MIT licensed.

A few months ago I would have rolled my eyes at this. A "caveman" skill for serious engineering work? Come on.

But the 65k stars are real. The benchmarks are honest. The research backing the brevity principle is real and peer-reviewed. My reduced bill at the end of the month was real. And the moment my AI refused to lie on my behalf was the moment I knew this entire ecosystem might actually be growing up.

Less talk. More ship. That's the whole point.

> _👏 __**If this saved you some tokens — or made you smile — a clap or a comment would honestly mean the world to me.**__ It's the small signal that tells me which posts are worth writing more of. Drop a comment with your own AI token-saving hack and I'll reply to every one._