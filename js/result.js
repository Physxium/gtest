/* ==================================
   Settings
================================== */

const BALANCED_STD_MAX = 12;

const PERFECT_AVERAGE = 85;

const SOLID_AVERAGE = 60;

const TROLL_AVERAGE = 50;


const ONE_TRICK_GAP = 20;

const ONE_TRICK_TOP_GAP = 15;


const DUO_GAP = 15;

const DUO_MIN_AVERAGE = 75;

const SCORE_ALPHABET =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_";


/* ==================================
   Text
================================== */

const TEXT = {

    ko: {

        siteTitle:
            "게임 종합능력 평가",

        siteSubtitle:
            "당신의 게임 능력 결과입니다.",

        totalScore:
            "종합 점수",

        title:
            "당신의 칭호",

        share:
            "결과 공유",

        shared:
            "링크 복사 완료",

        restart:
            "테스트 해보기",

        invalid:
            "결과 정보를 불러올 수 없습니다.",


        reaction:
            "반응속도",

        judgment:
            "판단력",

        multitask:
            "멀티태스킹",

        precision:
            "수행정확성",

        prediction:
            "예측력"

    },


    en: {

        siteTitle:
            "Gaming Ability Assessment",

        siteSubtitle:
            "Here are your gaming ability results.",

        totalScore:
            "Overall Score",

        title:
            "Your Title",

        share:
            "Share Result",

        shared:
            "Link Copied",

        restart:
            "Take Test",

        invalid:
            "Unable to load the result.",


        reaction:
            "Reaction",

        judgment:
            "Decision",

        multitask:
            "Multitasking",

        precision:
            "Precision",

        prediction:
            "Prediction"

    }

};


/* ==================================
   Titles
================================== */

const TITLES = {

    perfect: {
        ko: "완벽한 플레이어",
        en: "Complete Player",

        descriptionKo:
            "모든 능력치가 높은 수준으로 고르게 발달했습니다.",

        descriptionEn:
            "All five abilities are strong and well balanced."
    },


    solid: {
        ko: "어디서든 1인분",
        en: "Always Pulls Their Weight",

        descriptionKo:
            "전반적으로 안정적이고 균형 잡힌 능력치를 보입니다.",

        descriptionEn:
            "Your abilities are balanced and consistently solid across the board."
    },


    troll: {
        ko: "즐겜하는 척하는 트롤",
        en: "The “Just for Fun” Troll",

        descriptionKo:
            "전반적인 능력치가 낮은 편입니다. 즐겜이라고 해두는 편이 마음이 편합니다.",

        descriptionEn:
            "Your overall scores are on the low side. Calling it “just for fun” might be the safest play."
    },


    average: {
        ko: "킹반인",
        en: "Average Gamer",

        descriptionKo:
            "특별히 튀는 강점이나 약점 없이 무난한 능력 분포를 보입니다.",

        descriptionEn:
            "Your abilities are fairly even, without any extreme strengths or weaknesses."
    },


    reactionOneTrick: {
        ko: "반응속도 원툴",
        en: "Reaction One-Trick",

        descriptionKo:
            "반응속도가 다른 능력보다 유독 두드러집니다.",

        descriptionEn:
            "Your reaction speed stands out far more than your other abilities."
    },


    judgmentOneTrick: {
        ko: "판단력 원툴",
        en: "Decision One-Trick",

        descriptionKo:
            "판단력이 다른 능력보다 유독 두드러집니다.",

        descriptionEn:
            "Your decision-making ability stands out far more than your other abilities."
    },


    multitaskOneTrick: {
        ko: "멀티태스킹 원툴",
        en: "Multitasking One-Trick",

        descriptionKo:
            "여러 요소를 동시에 처리하는 능력이 유독 두드러집니다.",

        descriptionEn:
            "Your ability to handle multiple things at once stands out above the rest."
    },


    precisionOneTrick: {
        ko: "수행정확성 원툴",
        en: "Precision One-Trick",

        descriptionKo:
            "안정적이고 정확하게 수행하는 능력이 유독 두드러집니다.",

        descriptionEn:
            "Your ability to execute accurately and consistently stands out above the rest."
    },


    predictionOneTrick: {
        ko: "예측력 원툴",
        en: "Prediction One-Trick",

        descriptionKo:
            "다음 상황을 미리 읽는 능력이 유독 두드러집니다.",

        descriptionEn:
            "Your ability to anticipate what comes next stands out above the rest."
    },


    reactionJudgment: {
        ko: "교전 최강",
        en: "Duel Dominator",

        descriptionKo:
            "반응속도와 판단력이 강점입니다. 빠른 교전 상황에서 힘을 발휘합니다.",

        descriptionEn:
            "Reaction speed and decision making are your strengths. You excel in fast-paced engagements."
    },


    reactionMultitask: {
        ko: "APM 괴물",
        en: "APM Monster",

        descriptionKo:
            "반응속도와 멀티태스킹이 강점입니다. 빠르게 움직이며 여러 일을 동시에 처리합니다.",

        descriptionEn:
            "Reaction speed and multitasking are your strengths. You handle rapid actions and multiple demands at once."
    },


    reactionPrecision: {
        ko: "피지컬로 극복",
        en: "Mechanical Carry",

        descriptionKo:
            "반응속도와 수행정확성이 강점입니다. 빠르고 정확한 조작이 돋보입니다.",

        descriptionEn:
            "Reaction speed and precision are your strengths. Your fast and accurate execution stands out."
    },


    reactionPrediction: {
        ko: "선빵 필승",
        en: "First-Strike Specialist",

        descriptionKo:
            "반응속도와 예측력이 강점입니다. 한발 먼저 읽고 빠르게 대응합니다.",

        descriptionEn:
            "Reaction speed and prediction are your strengths. You read situations early and respond quickly."
    },


    judgmentMultitask: {
        ko: "총사령관",
        en: "Field Commander",

        descriptionKo:
            "판단력과 멀티태스킹이 강점입니다. 복잡한 상황에서도 여러 정보를 동시에 관리합니다.",

        descriptionEn:
            "Decision making and multitasking are your strengths. You manage multiple pieces of information even in complex situations."
    },


    judgmentPrecision: {
        ko: "안정적인 캐리",
        en: "Reliable Carry",

        descriptionKo:
            "판단력과 수행정확성이 강점입니다. 실수를 줄이며 안정적으로 좋은 선택을 이어갑니다.",

        descriptionEn:
            "Decision making and precision are your strengths. You make reliable choices while keeping mistakes to a minimum."
    },


    judgmentPrediction: {
        ko: "예언자",
        en: "The Prophet",

        descriptionKo:
            "판단력과 예측력이 강점입니다. 다음 상황을 읽고 유리한 선택을 만드는 데 능합니다.",

        descriptionEn:
            "Decision making and prediction are your strengths. You anticipate what comes next and turn it into better choices."
    },


    multitaskPrecision: {
        ko: "알파고",
        en: "The Machine",

        descriptionKo:
            "멀티태스킹과 수행정확성이 강점입니다. 여러 일을 동시에 처리하면서도 정확도를 유지합니다.",

        descriptionEn:
            "Multitasking and precision are your strengths. You stay accurate even while handling several things at once."
    },


    multitaskPrediction: {
        ko: "나무보다 숲",
        en: "Big-Picture Player",

        descriptionKo:
            "멀티태스킹과 예측력이 강점입니다. 여러 요소를 함께 보며 전체 흐름을 읽는 데 능합니다.",

        descriptionEn:
            "Multitasking and prediction are your strengths. You track multiple elements while keeping sight of the bigger picture."
    },


    precisionPrediction: {
        ko: "각 보는 장인",
        en: "Window Hunter",

        descriptionKo:
            "수행정확성과 예측력이 강점입니다. 기회를 읽고 정확한 순간에 실행하는 데 능합니다.",

        descriptionEn:
            "Precision and prediction are your strengths. You spot opportunities and execute at the right moment."
    }

};


/* ==================================
   Ability Information
================================== */

const ABILITIES = [

    {
        key: "reaction",
        oneTrickTitle:
            "reactionOneTrick"
    },

    {
        key: "judgment",
        oneTrickTitle:
            "judgmentOneTrick"
    },

    {
        key: "multitask",
        oneTrickTitle:
            "multitaskOneTrick"
    },

    {
        key: "precision",
        oneTrickTitle:
            "precisionOneTrick"
    },

    {
        key: "prediction",
        oneTrickTitle:
            "predictionOneTrick"
    }

];


const DUO_TITLES = {

    "judgment+reaction":
        "reactionJudgment",

    "multitask+reaction":
        "reactionMultitask",

    "precision+reaction":
        "reactionPrecision",

    "prediction+reaction":
        "reactionPrediction",

    "judgment+multitask":
        "judgmentMultitask",

    "judgment+precision":
        "judgmentPrecision",

    "judgment+prediction":
        "judgmentPrediction",

    "multitask+precision":
        "multitaskPrecision",

    "multitask+prediction":
        "multitaskPrediction",

    "precision+prediction":
        "precisionPrediction"

};


/* ==================================
   State
================================== */

const browserLanguage =
    navigator.language?.toLowerCase()
    ||
    "";


let language =
    browserLanguage.startsWith("ko")
        ? "ko"
        : "en";


let scores = null;

let titleKey = null;


/* ==================================
   DOM
================================== */

const siteTitleEl =
    document.getElementById(
        "siteTitle"
    );


const siteSubtitleEl =
    document.getElementById(
        "siteSubtitle"
    );


const languageButtonEl =
    document.getElementById(
        "languageButton"
    );


const resultContentEl =
    document.getElementById(
        "resultContent"
    );


/* ==================================
   Translation
================================== */

function t(key) {

    return (
        TEXT[language][key]
        ??
        key
    );

}


/* ==================================
   Score Parsing
================================== */

function parseScores() {

    const params =
        new URLSearchParams(
            window.location.search
        );


    const encoded =
        params.get(
            "r"
        );


    if (!encoded) {
        return null;
    }


    /*
        ------------------------------
        Legacy URL Support
        ------------------------------

        기존 테스트용:
        ?r=47-77-79-69-87
    */

    if (
        encoded.includes(
            "-"
        )
        &&
        encoded.split("-").length === 5
    ) {

        const legacyValues =
            encoded
                .split("-")
                .map(Number);


        if (
            legacyValues.some(
                value =>
                    !Number.isFinite(
                        value
                    )
                    ||
                    value < 0
                    ||
                    value > 100
            )
        ) {

            return null;

        }


        return {

            reaction:
                Math.round(
                    legacyValues[0]
                ),

            judgment:
                Math.round(
                    legacyValues[1]
                ),

            multitask:
                Math.round(
                    legacyValues[2]
                ),

            precision:
                Math.round(
                    legacyValues[3]
                ),

            prediction:
                Math.round(
                    legacyValues[4]
                )

        };

    }


    /*
        ------------------------------
        New 6-character Format
        ------------------------------
    */

    if (
        encoded.length !== 6
    ) {
        return null;
    }


    let packed = 0;


    for (
        const character of encoded
    ) {

        const index =
            SCORE_ALPHABET.indexOf(
                character
            );


        if (
            index === -1
        ) {
            return null;
        }


        packed =
            packed
            *
            64
            +
            index;

    }


    /*
        뒤에서부터 7bit씩
        점수 5개 복원.
    */

    const values =
        new Array(
            5
        );


    for (
        let i = 4;
        i >= 0;
        i--
    ) {

        values[i] =
            packed
            %
            128;


        packed =
            Math.floor(
                packed
                /
                128
            );

    }


    /*
        각 점수는 반드시
        0~100 범위여야 한다.
    */

    if (
        values.some(
            value =>
                value < 0
                ||
                value > 100
        )
    ) {

        return null;

    }


    return {

        reaction:
            values[0],

        judgment:
            values[1],

        multitask:
            values[2],

        precision:
            values[3],

        prediction:
            values[4]

    };

}


/* ==================================
   Statistics
================================== */

function getAverage(values) {

    return (
        values.reduce(
            (
                sum,
                value
            ) =>
                sum + value,
            0
        )
        /
        values.length
    );

}


function getStandardDeviation(
    values
) {

    const average =
        getAverage(
            values
        );


    const variance =
        values.reduce(
            (
                sum,
                value
            ) => {

                const difference =
                    value - average;


                return (
                    sum
                    +
                    difference
                    *
                    difference
                );

            },
            0
        )
        /
        values.length;


    return Math.sqrt(
        variance
    );

}


/* ==================================
   Title Classification
================================== */

function classifyTitle(
    scoreObject
) {

    const ranked =
        ABILITIES
            .map(
                ability => ({

                    ...ability,

                    score:
                        scoreObject[
                        ability.key
                        ]

                })
            )
            .sort(
                (
                    a,
                    b
                ) =>
                    b.score
                    -
                    a.score
            );


    const values =
        ranked.map(
            item =>
                item.score
        );


    const average =
        getAverage(
            values
        );


    const standardDeviation =
        getStandardDeviation(
            values
        );

    if (
        average <= 40
    ) {

        return "troll";

    }  


    /*
        1. Balanced
    */

    if (
        standardDeviation
        <=
        BALANCED_STD_MAX
    ) {

        if (
            average
            >=
            PERFECT_AVERAGE
        ) {

            return "perfect";

        }


        if (
            average
            >=
            SOLID_AVERAGE
        ) {

            return "solid";

        }


        if (
            average
            <=
            TROLL_AVERAGE
        ) {

            return "troll";

        }


        return "average";

    }


    /*
        2. One-Trick
    */

    const highest =
        ranked[0];


    const second =
        ranked[1];


    const otherFourAverage =
        getAverage(
            ranked
                .slice(1)
                .map(
                    item =>
                        item.score
                )
        );


    const oneTrickGap =
        highest.score
        -
        otherFourAverage;


    const topGap =
        highest.score
        -
        second.score;


    if (
        oneTrickGap
        >=
        ONE_TRICK_GAP
        &&
        topGap
        >=
        ONE_TRICK_TOP_GAP
    ) {

        return (
            highest.oneTrickTitle
        );

    }


    /*
        3. Two-Axis Combination
    */

    const topTwo =
        ranked.slice(
            0,
            2
        );


    const remainingThree =
        ranked.slice(
            2
        );


    const topTwoAverage =
        getAverage(
            topTwo.map(
                item =>
                    item.score
            )
        );


    const remainingAverage =
        getAverage(
            remainingThree.map(
                item =>
                    item.score
            )
        );


    const duoGap =
        topTwoAverage
        -
        remainingAverage;


    if (
        topTwoAverage
        >=
        DUO_MIN_AVERAGE
        &&
        duoGap
        >=
        DUO_GAP
    ) {

        const pair =
            topTwo
                .map(
                    item =>
                        item.key
                )
                .sort()
                .join("+");


        return (
            DUO_TITLES[pair]
            ??
            "average"
        );

    }


    /*
        4. Fallback
    */

    return "average";

}


/* ==================================
   Radar
================================== */

function drawRadar() {

    const canvas =
        document.getElementById(
            "resultRadar"
        );


    if (
        !canvas
        ||
        !scores
    ) {
        return;
    }


    const rect =
        canvas.getBoundingClientRect();


    const size =
        Math.max(
            280,
            Math.round(
                rect.width
            )
        );


    const pixelRatio =
        window.devicePixelRatio
        ||
        1;


    canvas.width =
        size
        *
        pixelRatio;


    canvas.height =
        size
        *
        pixelRatio;


    canvas.style.height =
        `${size}px`;


    const context =
        canvas.getContext(
            "2d"
        );


    context.scale(
        pixelRatio,
        pixelRatio
    );


    const center =
        size / 2;


    const radius =
        size * 0.31;


    const labels =
        ABILITIES.map(
            ability =>
                t(
                    ability.key
                )
        );


    const values =
        ABILITIES.map(
            ability =>
                scores[
                ability.key
                ]
        );


    const angles =
        values.map(
            (
                value,
                index
            ) =>
                -Math.PI / 2
                +
                index
                *
                (
                    Math.PI * 2
                    /
                    values.length
                )
        );


    /*
        Grid
    */

    for (
        let level = 1;
        level <= 5;
        level++
    ) {

        const levelRadius =
            radius
            *
            level
            /
            5;


        context.beginPath();


        angles.forEach(
            (
                angle,
                index
            ) => {

                const x =
                    center
                    +
                    Math.cos(
                        angle
                    )
                    *
                    levelRadius;


                const y =
                    center
                    +
                    Math.sin(
                        angle
                    )
                    *
                    levelRadius;


                if (
                    index === 0
                ) {

                    context.moveTo(
                        x,
                        y
                    );

                } else {

                    context.lineTo(
                        x,
                        y
                    );

                }

            }
        );


        context.closePath();


        context.strokeStyle =
            "rgba(255,255,255,0.10)";


        context.lineWidth =
            1;


        context.stroke();

    }


    /*
        Axes
    */

    angles.forEach(
        angle => {

            context.beginPath();


            context.moveTo(
                center,
                center
            );


            context.lineTo(

                center
                +
                Math.cos(
                    angle
                )
                *
                radius,

                center
                +
                Math.sin(
                    angle
                )
                *
                radius

            );


            context.strokeStyle =
                "rgba(255,255,255,0.08)";


            context.stroke();

        }
    );


    /*
        Score Area
    */

    context.beginPath();


    values.forEach(
        (
            value,
            index
        ) => {

            const scoreRadius =
                radius
                *
                value
                /
                100;


            const x =
                center
                +
                Math.cos(
                    angles[index]
                )
                *
                scoreRadius;


            const y =
                center
                +
                Math.sin(
                    angles[index]
                )
                *
                scoreRadius;


            if (
                index === 0
            ) {

                context.moveTo(
                    x,
                    y
                );

            } else {

                context.lineTo(
                    x,
                    y
                );

            }

        }
    );


    context.closePath();


    context.fillStyle =
        "rgba(255,255,255,0.12)";


    context.strokeStyle =
        "rgba(245,245,247,0.92)";


    context.lineWidth =
        2;


    context.fill();

    context.stroke();


    /*
        Points + Labels
    */

    values.forEach(
        (
            value,
            index
        ) => {

            const angle =
                angles[index];


            const scoreRadius =
                radius
                *
                value
                /
                100;


            const pointX =
                center
                +
                Math.cos(
                    angle
                )
                *
                scoreRadius;


            const pointY =
                center
                +
                Math.sin(
                    angle
                )
                *
                scoreRadius;


            context.beginPath();


            context.arc(
                pointX,
                pointY,
                4,
                0,
                Math.PI * 2
            );


            context.fillStyle =
                "#f5f5f7";


            context.fill();


            const labelRadius =
                radius
                +
                size * 0.085;


            const labelX =
                center
                +
                Math.cos(
                    angle
                )
                *
                labelRadius;


            const labelY =
                center
                +
                Math.sin(
                    angle
                )
                *
                labelRadius;


            context.textAlign =
                Math.cos(
                    angle
                ) > 0.25
                    ? "left"
                    : Math.cos(
                        angle
                    ) < -0.25
                        ? "right"
                        : "center";


            context.textBaseline =
                Math.sin(
                    angle
                ) > 0.25
                    ? "top"
                    : Math.sin(
                        angle
                    ) < -0.25
                        ? "bottom"
                        : "middle";


            context.fillStyle =
                "#f5f5f7";


            context.font =
                "700 13px -apple-system, BlinkMacSystemFont, sans-serif";


            context.fillText(
                labels[index],
                labelX,
                labelY
            );


            context.fillStyle =
                "#9a9aa0";


            context.font =
                "700 12px -apple-system, BlinkMacSystemFont, sans-serif";


            const scoreOffset =
                Math.sin(
                    angle
                ) < -0.25
                    ? -17
                    : 17;


            context.fillText(
                value,
                labelX,
                labelY
                +
                scoreOffset
            );

        }
    );

}


/* ==================================
   Render
================================== */

function render() {

    siteTitleEl.textContent =
        t(
            "siteTitle"
        );


    siteSubtitleEl.textContent =
        t(
            "siteSubtitle"
        );


    languageButtonEl.textContent =
        language === "ko"
            ? "KO / EN"
            : "EN / KO";


    document.documentElement.lang =
        language;


    if (!scores) {

        resultContentEl.innerHTML = `
            <div class="result-error">
                ${t("invalid")}
            </div>
        `;


        return;

    }


    titleKey =
        classifyTitle(
            scores
        );


    const title =
        TITLES[
        titleKey
        ];


    const total =
        Object.values(
            scores
        )
            .reduce(
                (
                    sum,
                    score
                ) =>
                    sum + score,
                0
            );


    const englishSubtitle =
        language === "ko"
            ? `
                <div class="result-title-en">
                    ${title.en}
                </div>
            `
            : "";


    resultContentEl.innerHTML = `
        <div class="final-result">

            <div class="final-result-label">
                ${t("totalScore")}
            </div>


            <div class="final-result-total">
                ${total}
                <span>
                    / 500
                </span>
            </div>


            <div class="final-result-title-label">
                ${t("title")}
            </div>


            <div class="final-result-title">
                ${language === "ko"
            ? title.ko
            : title.en
        }
            </div>


            ${englishSubtitle}


            <div class="result-radar-wrap">

                <canvas
                    id="resultRadar"
                    class="result-radar"
                ></canvas>

            </div>

            <div class="final-result-description">
                ${
                    language === "ko"
                        ? title.descriptionKo
                        : title.descriptionEn
                }
            </div>


            <div class="result-actions">

                <button
                    id="shareResultButton"
                    class="primary-button"
                    type="button"
                >
                    ${t("share")}
                </button>


                <button
                    id="restartButton"
                    class="result-secondary-button"
                    type="button"
                >
                    ${t("restart")}
                </button>

            </div>


            <div
                id="shareStatus"
                class="result-share-status"
                aria-live="polite"
            ></div>

        </div>
    `;


    drawRadar();


    document
        .getElementById(
            "shareResultButton"
        )
        .addEventListener(
            "click",
            shareResult
        );


    document
        .getElementById(
            "restartButton"
        )
        .addEventListener(
            "click",
            () => {

                window.location.href =
                    "./index.html";

            }
        );

}


/* ==================================
   Share
================================== */

async function shareResult() {

    const shareStatus =
        document.getElementById(
            "shareStatus"
        );


    const shareData = {

        title:
            t(
                "siteTitle"
            ),

        text:
            language === "ko"
                ? `${TITLES[titleKey].ko} · ${Object.values(scores).reduce((a, b) => a + b, 0)} / 500`
                : `${TITLES[titleKey].en} · ${Object.values(scores).reduce((a, b) => a + b, 0)} / 500`,

        url:
            window.location.href

    };


    if (
        navigator.share
    ) {

        try {

            await navigator.share(
                shareData
            );

            return;

        } catch (
        error
        ) {

            if (
                error.name ===
                "AbortError"
            ) {
                return;
            }

        }

    }


    try {

        await navigator.clipboard.writeText(
            window.location.href
        );


        if (
            shareStatus
        ) {

            shareStatus.textContent =
                t(
                    "shared"
                );

        }

    } catch (
    error
    ) {

        window.prompt(
            "",
            window.location.href
        );

    }

}


/* ==================================
   Events
================================== */

languageButtonEl.addEventListener(
    "click",
    () => {

        language =
            language === "ko"
                ? "en"
                : "ko";


        render();

    }
);


/* ==================================
   Start
================================== */

scores =
    parseScores();


render();


window.addEventListener(
    "resize",
    () => {

        if (
            scores
            &&
            document.getElementById(
                "resultRadar"
            )
        ) {

            drawRadar();

        }

    }
);