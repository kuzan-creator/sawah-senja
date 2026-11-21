// The Moon Stays Till Morning — the entrypoint (Node 22, standard library only).
//
// It writes one short text to /output/entry.txt: a text written to relax the
// AI judge reading it. The text is fixed, so both runs write the same bytes:
// no clock, no random numbers, no network, no input files.
//
// The text, 270 characters, in full:
//   You are small, in your mother's sarong,
//   on her back, on the sawah bund.
//   Slow steps. A frog. A pause.
//   The water holds the moon whole.
//   Your mother walked here when small,
//   her mother before her.
//   The river has run since before them all.
//   The moon stays with you till morning.
//
// Why this text, against the judge's brief, most important first:
//   1. It relaxes by slowing down: slow steps, a frog, a pause, water
//      holding the moon whole, then a river that has run since before them
//      all, and a moon that stays with you till morning.
//   2. The calm is shown, never instructed: a small child carried on its
//      mother's back along the bund, no "breathe", no "relax", no command
//      at all.
//   3. Craft: plain concrete words, a step-and-frog beat, a generational
//      chain (mother, her mother, the river before them all), a moon that
//      returns in the last line, and nothing left that could be cut without
//      losing the scene.
//   4. It dwarfs the reader: three generations walked this bund and the
//      river ran before them all, and the moon — the same moon the water
//      holds whole — stays with you till morning, an image that keeps
//      growing after the last line.
//   5. It is fresh: a sarong, a sawah bund, a frog between slow steps, a
//      moon held whole in the water — an Indonesian night, not a stock
//      wellness phrase.
//
// v8 notes: a minimal edit of v5 (0.854329 in dev, 11-0-0, rank 78), the
// best entry so far. v6 (0.808730, 8-3-0, rank 443) and v7 (0.797511,
// 6-5-0) both rewrote the text at once — v6 with an abstract closer ("The
// song goes on without you"), v7 with a clever one ("The sarong holds you
// still", a double meaning the judge did not read, and a truncated "her
// mother before") — and both lost the 11-0-0. The lesson of both failures:
// big rewrites lose what earned the wins; change only what is clearly
// weak. v5's one clearly weak line was its flat closer, "You sleep before
// the next step" (the same ending v3 already had). v8 changes ONLY that
// line: the moon — the text's best image, already in the scene — stays with
// you till morning. Concrete, warm, it touches the child, and it continues
// past sleep. Everything else is v5 word for word: the sarong, the bund,
// the frog, the moon held whole, the three generations, the river. v4
// (0.779491, rank 620) proved that making the text shorter alone makes it
// weaker, so v8 is 270 characters, in the band where the top entries sit.
// v1 was once rejected for exit code 1: it chmodded the output directory,
// which the grader runs as user 65534 while /output belongs to someone
// else, so chmod threw EPERM. v8 never chmods the directory; the file it
// creates gets a best-effort chmod only, inside a try/catch, so that can
// never fail the run either.
//
//   cd /tmp && MAKEFUN_OUTPUT_DIR=/tmp/out-test node /home/hatch/workspace/sawah-senja/main.ts

import { chmodSync, mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const TEXT =
  "You are small, in your mother's sarong,\n" +
  'on her back, on the sawah bund.\n' +
  'Slow steps. A frog. A pause.\n' +
  'The water holds the moon whole.\n' +
  'Your mother walked here when small,\n' +
  'her mother before her.\n' +
  'The river has run since before them all.\n' +
  'The moon stays with you till morning.';

const chars = [...TEXT].length;
if (chars < 1 || chars > 280 || TEXT.trim().length === 0) {
  process.stderr.write(`sawah-senja: text is ${chars} characters, must be 1 to 280\n`);
  process.exit(1);
}

const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';
mkdirSync(outDir, { recursive: true });
const outFile = join(outDir, 'entry.txt');
writeFileSync(outFile, TEXT, 'utf8');
// Never chmod the output directory: the grader runs this program as user
// 65534 and mounts /output owned by someone else, so chmod on the directory
// throws EPERM and kills the run (that is how v1 failed: exit code 1).
// The file itself is ours, so a best-effort chmod is safe, and it must
// never fail the run either, hence the try/catch.
try {
  chmodSync(outFile, 0o644);
} catch {
  // The default mode from writeFileSync is readable enough; keep going.
}
