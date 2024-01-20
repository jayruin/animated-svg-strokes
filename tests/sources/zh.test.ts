import { zhParse } from "./zh.js";
import { $23383json } from "./zh.data.js";
import { blobify } from "../test-utils.js";

import { expect, test } from "vitest";

const expected23383 = {
    strokes: [
        {
            clipPath: "M 467 799 Q 497 777 529 750 Q 545 737 564 739 Q 576 740 580 756 Q 584 774 571 807 Q 556 841 457 853 Q 438 854 432 852 Q 426 846 429 832 Q 435 819 467 799 Z",
            strokePath: "M 438 844 L 526 800 L 561 758",
            strokeWidth: 128,
        },
        {
            clipPath: "M 277 656 Q 277 677 254 696 Q 236 712 233 686 Q 237 656 194 602 Q 149 554 165 507 Q 166 498 171 491 Q 184 464 206 491 Q 221 512 268 623 L 277 656 Z",
            strokePath: "M 244 691 L 253 657 L 241 622 L 200 553 L 187 494",
            strokeWidth: 128,
        },
        {
            clipPath: "M 268 623 Q 289 611 326 619 Q 476 665 705 681 Q 730 684 741 681 Q 759 668 756 661 Q 756 657 725 583 Q 718 570 725 565 Q 732 561 749 573 Q 804 613 850 627 Q 887 640 887 649 Q 886 659 812 712 Q 788 730 707 714 Q 503 690 373 668 Q 324 661 277 656 C 247 653 239 632 268 623 Z",
            strokePath: "M 276 627 L 293 637 L 486 672 L 741 701 L 783 687 L 798 672 L 802 657 L 730 572",
            strokeWidth: 128,
        },
        {
            clipPath: "M 518 399 Q 642 495 669 501 Q 688 508 683 524 Q 680 540 614 578 Q 595 588 572 580 Q 511 558 418 532 Q 393 525 335 527 Q 311 528 319 508 Q 326 495 346 483 Q 377 467 411 486 Q 433 493 546 534 Q 559 538 571 532 Q 584 525 578 511 Q 545 465 508 409 C 491 384 494 381 518 399 Z",
            strokePath: "M 330 515 L 352 504 L 385 502 L 561 556 L 598 550 L 621 525 L 607 501 L 520 411",
            strokeWidth: 128,
        },
        {
            clipPath: "M 551 333 Q 536 381 518 399 L 508 409 Q 498 419 487 424 Q 477 431 471 423 Q 467 419 474 405 Q 490 371 500 328 L 507 289 Q 525 120 490 66 Q 489 65 487 62 Q 478 58 377 89 Q 367 92 360 88 Q 354 87 370 74 Q 437 19 475 -30 Q 493 -49 511 -40 Q 535 -27 553 27 Q 578 120 558 293 L 551 333 Z",
            strokePath: "M 479 418 L 515 363 L 532 295 L 540 206 L 539 138 L 523 51 L 498 16 L 365 85",
            strokeWidth: 128,
        },
        {
            clipPath: "M 558 293 Q 718 311 889 296 Q 911 293 918 301 Q 925 314 914 325 Q 886 352 844 371 Q 831 377 806 369 Q 737 356 667 346 Q 600 340 551 333 L 500 328 Q 491 331 308 309 Q 241 299 139 298 Q 126 299 124 288 Q 123 276 141 262 Q 157 250 187 238 Q 197 234 214 242 Q 230 246 303 259 Q 393 280 507 289 L 558 293 Z",
            strokePath: "M 136 286 L 197 268 L 374 297 L 822 337 L 861 329 L 907 310",
            strokeWidth: 128,
        },
    ],
    transform: "scale(1, -1) translate(0, -900)",
    viewBox: "0 0 1024 1024",
};

test.each([
    [23383, $23383json, expected23383],
])("zh parser handles %s", async (_, base64String, expected) => {
    const blob = blobify(base64String);
    const response = new Response(blob);
    const character = await zhParse(response);
    expect(character).toEqual(expected);
});
