const reactionGame = (() => {

    /* ------------------------------
       Game Settings
    ------------------------------ */

    const TOTAL_TRIALS = 10;

    const GREEN_TRIALS = 7;
    const RED_TRIALS = 3;

    const LIGHT_DURATION = 700;

    const MIN_WAIT = 650;
    const MAX_WAIT = 1350;


    /* ------------------------------
       Runtime State
    ------------------------------ */

    let stageElement = null;
    let statusElement = null;

    let playSound = () => { };
    let onFinish = () => { };

    let sequence = [];

    let currentTrial = 0;

    let activeTile = null;
    let activeType = null;

    let lightStartedAt = 0;

    let waitingTimer = null;
    let lightTimer = null;

    let gameRunning = false;
    let acceptingInput = false;

    let reactionTimes = [];

    let rawScore = 0;

    let greenHits = 0;
    let greenMisses = 0;
    let redMistakes = 0;


    /* ------------------------------
       Helpers
    ------------------------------ */

    function shuffle(array) {

        const result = [...array];

        for (
            let i = result.length - 1;
            i > 0;
            i--
        ) {

            const j =
                Math.floor(
                    Math.random() * (i + 1)
                );

            [
                result[i],
                result[j]
            ] = [
                    result[j],
                    result[i]
                ];

        }

        return result;
    }


    function randomBetween(min, max) {

        return (
            min +
            Math.random() * (max - min)
        );
    }


    function createSequence() {

        const trials = [
            ...Array(GREEN_TRIALS).fill("green"),
            ...Array(RED_TRIALS).fill("red")
        ];

        return shuffle(trials);
    }


    function getReactionPoints(ms) {

        /*
            임시 점수식
    
            150ms 이하 = 10점
            550ms 이상 = 0점
            그 사이는 선형 감소
    
            실제 플레이 후 조정 예정
        */

        if (ms <= 150) {
            return 10;
        }

        if (ms >= 550) {
            return 0;
        }

        return (
            10 *
            (550 - ms) /
            400
        );
    }


    /* ------------------------------
       Render
    ------------------------------ */

    function renderBoard() {

        stageElement.innerHTML = `
        <div class="reaction-wrap">

            <div
                id="reactionTrialCounter"
                class="reaction-trial-counter"
            >
                1 / ${TOTAL_TRIALS}
            </div>

            <div class="reaction-board">

                <button
                    class="reaction-tile"
                    data-tile="0"
                    type="button"
                    aria-label="Tile 1"
                ></button>

                <button
                    class="reaction-tile"
                    data-tile="1"
                    type="button"
                    aria-label="Tile 2"
                ></button>

                <button
                    class="reaction-tile"
                    data-tile="2"
                    type="button"
                    aria-label="Tile 3"
                ></button>

                <button
                    class="reaction-tile"
                    data-tile="3"
                    type="button"
                    aria-label="Tile 4"
                ></button>

            </div>

            <div
                id="reactionMessage"
                class="reaction-message"
            >
                준비
            </div>

        </div>
    `;


        stageElement
            .querySelectorAll(
                ".reaction-tile"
            )
            .forEach(tile => {

                tile.addEventListener(
                    "pointerdown",
                    handleTilePress
                );

            });
    }


    function getTiles() {

        return [
            ...stageElement.querySelectorAll(
                ".reaction-tile"
            )
        ];
    }


    function clearTiles() {

        getTiles().forEach(tile => {

            tile.classList.remove(
                "green",
                "red",
                "pressed"
            );

        });

        activeTile = null;
        activeType = null;

        acceptingInput = false;
    }


    function setMessage(text) {

        const messageElement =
            document.getElementById(
                "reactionMessage"
            );

        if (messageElement) {
            messageElement.textContent = text;
        }
    }


    function updateProgress() {

        const shownTrial =
            Math.min(
                currentTrial + 1,
                TOTAL_TRIALS
            );


        const counterElement =
            document.getElementById(
                "reactionTrialCounter"
            );


        if (counterElement) {

            counterElement.textContent =
                `${shownTrial} / ${TOTAL_TRIALS}`;

        }


        if (statusElement) {

            statusElement.textContent = "";

        }
    }


    /* ------------------------------
       Countdown
    ------------------------------ */

    function startCountdown() {

        let count = 3;

        setMessage(count);


        const countdownTimer =
            setInterval(() => {

                count -= 1;

                if (count > 0) {

                    setMessage(count);

                    return;
                }


                clearInterval(
                    countdownTimer
                );

                setMessage("");

                scheduleNextTrial();

            }, 650);
    }


    /* ------------------------------
       Trial
    ------------------------------ */

    function scheduleNextTrial() {

        if (!gameRunning) {
            return;
        }


        if (
            currentTrial >=
            TOTAL_TRIALS
        ) {

            finishGame();

            return;
        }


        clearTiles();

        updateProgress();

        setMessage("");


        const wait =
            randomBetween(
                MIN_WAIT,
                MAX_WAIT
            );


        waitingTimer =
            setTimeout(
                showTrial,
                wait
            );
    }


    function showTrial() {

        if (!gameRunning) {
            return;
        }


        const tiles =
            getTiles();


        const tileIndex =
            Math.floor(
                Math.random() *
                tiles.length
            );


        activeTile =
            tiles[tileIndex];


        activeType =
            sequence[currentTrial];


        activeTile.classList.add(
            activeType
        );


        acceptingInput = true;

        lightStartedAt =
            performance.now();


        lightTimer =
            setTimeout(
                handleTrialTimeout,
                LIGHT_DURATION
            );
    }


    function handleTrialTimeout() {

        if (!gameRunning) {
            return;
        }


        acceptingInput = false;


        if (
            activeType === "green"
        ) {

            greenMisses += 1;

            playSound("wrong");

        }


        finishTrial();
    }


    function handleTilePress(event) {

        if (
            !gameRunning ||
            !acceptingInput
        ) {

            return;
        }


        const pressedTile =
            event.currentTarget;


        /*
            불이 들어온 타일이 아닌 곳을
            누른 경우에는 현재 버전에서는
            아무 처리하지 않는다.
        */

        if (
            pressedTile !==
            activeTile
        ) {

            return;
        }


        acceptingInput = false;

        clearTimeout(
            lightTimer
        );


        pressedTile.classList.add(
            "pressed"
        );


        if (
            activeType === "green"
        ) {

            handleGreenHit();

        } else {

            handleRedHit();

        }


        setTimeout(
            finishTrial,
            550
        );
    }


    function handleGreenHit() {

        const reactionTime =
            performance.now() -
            lightStartedAt;


        reactionTimes.push(
            reactionTime
        );


        greenHits += 1;


        rawScore +=
            getReactionPoints(
                reactionTime
            );


        playSound("correct");


        setMessage(
            `${Math.round(reactionTime)} ms`
        );
    }


    function handleRedHit() {

        redMistakes += 1;

        rawScore -= 5;

        playSound("wrong");
    }


    function finishTrial() {

        clearTimeout(
            lightTimer
        );


        clearTiles();


        currentTrial += 1;


        setTimeout(
            scheduleNextTrial,
            260
        );
    }


    /* ------------------------------
       Score
    ------------------------------ */

    function calculateFinalScore() {

        /*
            초록색 7회 × 최대 10점
            = 최대 raw 70점

            빨간색 오클릭은
            raw -5점

            이후 0~100으로 변환
        */

        const maxRawScore =
            GREEN_TRIALS * 10;


        const normalized =
            (
                rawScore /
                maxRawScore
            ) * 100;


        return Math.round(
            Math.max(
                0,
                Math.min(
                    100,
                    normalized
                )
            )
        );
    }


    function calculateAverageReaction() {

        if (
            reactionTimes.length === 0
        ) {

            return null;
        }


        const total =
            reactionTimes.reduce(
                (sum, value) =>
                    sum + value,
                0
            );


        return Math.round(
            total /
            reactionTimes.length
        );
    }


    /* ------------------------------
       Finish
    ------------------------------ */

    function finishGame() {

        gameRunning = false;

        clearTimeout(
            waitingTimer
        );

        clearTimeout(
            lightTimer
        );


        clearTiles();


        const result = {

            score:
                calculateFinalScore(),

            averageReaction:
                calculateAverageReaction(),

            greenHits,

            greenMisses,

            redMistakes,

            reactionTimes:
                [...reactionTimes]
        };


        if (statusElement) {
            statusElement.textContent = "";
        }


        onFinish(result);
    }


    /* ------------------------------
       Start
    ------------------------------ */

    function start(options) {

        stageElement =
            options.stageElement;


        statusElement =
            options.statusElement;


        playSound =
            options.playSound ||
            (() => { });


        onFinish =
            options.onFinish ||
            (() => { });


        sequence =
            createSequence();


        currentTrial = 0;

        activeTile = null;
        activeType = null;

        reactionTimes = [];

        rawScore = 0;

        greenHits = 0;
        greenMisses = 0;
        redMistakes = 0;

        gameRunning = true;
        acceptingInput = false;


        renderBoard();

        startCountdown();
    }


    /* ------------------------------
       Public API
    ------------------------------ */

    return {
        start
    };

})();