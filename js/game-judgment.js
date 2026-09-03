const judgmentGame = (() => {

    /* ------------------------------
       Settings
    ------------------------------ */

    const GRID_SIZE = 3;

    const GAME_DURATION = 35;

    const MOVE_DURATION = 250;

    const BEAT_DURATION = 1000;

    const ATTACK_COUNTDOWN_BEATS = 3;

    const ATTACK_COUNTDOWN =
        BEAT_DURATION *
        ATTACK_COUNTDOWN_BEATS;


    const PHASES = [

        {
            start: 0,
            end: 5,
            spawnEveryBeats: 3,
            attacksPerSpawn: 1
        },

        {
            start: 5,
            end: 10,
            spawnEveryBeats: 2,
            attacksPerSpawn: 1
        },

        {
            start: 10,
            end: 15,
            spawnEveryBeats: 1,
            attacksPerSpawn: 1
        },

        {
            start: 15,
            end: 20,
            spawnEveryBeats: 2,
            attacksPerSpawn: 2
        },

        {
            start: 20,
            end: 25,
            spawnEveryBeats: 1,
            attacksPerSpawn: 2
        },

        {
            start: 25,
            end: 35,
            spawnEveryBeats: 2,
            attacksPerSpawn: 3
        }

    ];


    /* ------------------------------
       Runtime
    ------------------------------ */

    let stageElement = null;
    let statusElement = null;

    let playSound = () => { };
    let onFinish = () => { };

    let labels = {
        hits: "HIT",
        ready: "READY"
    };


    let gameRunning = false;
    let gameStarted = false;

    let startTime = 0;

    let animationFrame = null;

    let nextSpawnBeat = 0;


    let playerRow = 1;
    let playerCol = 1;

    let visualRow = 1;
    let visualCol = 1;

    let moving = false;

    let moveFinishTime = 0;

    let moveTargetRow = 1;
    let moveTargetCol = 1;


    let attacks = [];

    let nextAttackId = 1;


    let hitCount = 0;
    let totalAttacks = 0;


    /* ------------------------------
       Helpers
    ------------------------------ */

    function randomInt(max) {

        return Math.floor(
            Math.random() * max
        );

    }


    function getPhase(time) {

        return (
            PHASES.find(
                phase =>
                    time >= phase.start &&
                    time < phase.end
            )
            ??
            PHASES[PHASES.length - 1]
        );

    }


    function getPlayerElement() {

        return stageElement.querySelector(
            "#judgmentPlayer"
        );

    }


    function getBoardElement() {

        return stageElement.querySelector(
            "#judgmentBoard"
        );

    }


    /* ------------------------------
       Render
    ------------------------------ */

    function renderBoard() {

        const cells = [];


        for (
            let row = 0;
            row < GRID_SIZE;
            row++
        ) {

            for (
                let col = 0;
                col < GRID_SIZE;
                col++
            ) {

                cells.push(`
                    <button
                        class="judgment-cell"
                        type="button"
                        data-row="${row}"
                        data-col="${col}"
                        aria-label="Row ${row + 1}, Column ${col + 1}"
                    ></button>
                `);

            }

        }


        stageElement.innerHTML = `
            <div class="judgment-wrap">

                <div class="judgment-hud">

                    <span
                        id="judgmentTimer"
                        class="judgment-timer"
                    >
                        ${GAME_DURATION.toFixed(1)}s
                    </span>

                    <span
                        id="judgmentHits"
                        class="judgment-hits"
                    >
                        ${labels.hits} 0
                    </span>

                </div>


                <div
                    id="judgmentBoard"
                    class="judgment-board"
                >

                    ${cells.join("")}


                    <div
                        id="judgmentAttackLayer"
                        class="judgment-attack-layer"
                    ></div>


                    <div
                        id="judgmentPlayer"
                        class="judgment-player"
                    >
                        <div
                            class="judgment-player-dot"
                        ></div>
                    </div>

                </div>


                <div
                    id="judgmentMessage"
                    class="judgment-message"
                ></div>

            </div>
        `;


        stageElement
            .querySelectorAll(
                ".judgment-cell"
            )
            .forEach(cell => {

                cell.addEventListener(
                    "click",
                    handleCellClick
                );

            });


        updatePlayerVisual(
            false
        );

    }


    /* ------------------------------
       Player
    ------------------------------ */

    function updatePlayerVisual(
        animate = true
    ) {

        const playerElement =
            getPlayerElement();


        if (!playerElement) {
            return;
        }


        if (!animate) {

            playerElement.classList.add(
                "no-transition"
            );

        }


        playerElement.style.transform =
            `
                translate(
                    ${visualCol * 100}%,
                    ${visualRow * 100}%
                )
            `;


        if (!animate) {

            requestAnimationFrame(
                () => {

                    playerElement
                        ?.classList.remove(
                            "no-transition"
                        );

                }
            );

        }

    }


    function handleCellClick(event) {

        if (
            !gameRunning ||
            !gameStarted
        ) {
            return;
        }


        const cell =
            event.currentTarget;


        const row =
            Number(
                cell.dataset.row
            );


        const col =
            Number(
                cell.dataset.col
            );


        if (moving) {

            flashInvalidCell(
                cell
            );

            return;

        }


        const distance =
            Math.abs(
                row - playerRow
            )
            +
            Math.abs(
                col - playerCol
            );


        if (distance !== 1) {

            flashInvalidCell(
                cell
            );

            return;

        }


        startMove(
            row,
            col
        );

    }


    function flashInvalidCell(cell) {

        cell.classList.remove(
            "invalid"
        );


        void cell.offsetWidth;


        cell.classList.add(
            "invalid"
        );


        setTimeout(
            () => {

                cell.classList.remove(
                    "invalid"
                );

            },
            180
        );

    }


    function startMove(
        row,
        col
    ) {

        moving = true;

        moveTargetRow = row;
        moveTargetCol = col;


        visualRow = row;
        visualCol = col;


        moveFinishTime =
            performance.now()
            +
            MOVE_DURATION;


        updatePlayerVisual(
            true
        );

    }


    function finishMove() {

        playerRow =
            moveTargetRow;

        playerCol =
            moveTargetCol;


        moving = false;

    }


    /* ------------------------------
       Attack Creation
    ------------------------------ */

    function createAttack(
        createdAt,
        forcedAxis = null
    ) {

        const available = [];


        for (
            let index = 0;
            index < GRID_SIZE;
            index++
        ) {

            if (
                forcedAxis === null
                ||
                forcedAxis === "row"
            ) {

                const rowBusy =
                    attacks.some(
                        attack =>
                            attack.axis === "row"
                            &&
                            attack.index === index
                    );


                if (!rowBusy) {

                    available.push({
                        axis: "row",
                        index
                    });

                }

            }


            if (
                forcedAxis === null
                ||
                forcedAxis === "col"
            ) {

                const colBusy =
                    attacks.some(
                        attack =>
                            attack.axis === "col"
                            &&
                            attack.index === index
                    );


                if (!colBusy) {

                    available.push({
                        axis: "col",
                        index
                    });

                }

            }

        }


        /*
            해당 축에 생성 가능한 줄이 없으면
            이번 공격은 취소.
        */

        if (!available.length) {
            return false;
        }


        const choice =
            available[
            randomInt(
                available.length
            )
            ];


        let side;


        if (
            choice.axis === "row"
        ) {

            side =
                Math.random() < 0.5
                    ? "left"
                    : "right";

        } else {

            side =
                Math.random() < 0.5
                    ? "top"
                    : "bottom";

        }


        attacks.push({

            id:
                nextAttackId++,

            axis:
                choice.axis,

            index:
                choice.index,

            side,

            createdAt,

            detonateAt:
                createdAt
                +
                ATTACK_COUNTDOWN

        });


        return true;

    }


    function spawnWave(
        spawnBeat
    ) {

        const spawnTime =
            spawnBeat
            *
            BEAT_DURATION;


        const projectedExplosionTime =
            (
                spawnTime
                +
                ATTACK_COUNTDOWN
            )
            /
            1000;


        const phase =
            getPhase(
                projectedExplosionTime
            );


        const createdAt =
            startTime
            +
            spawnTime;


        const count =
            phase.attacksPerSpawn;


        /*
            1개:
            가로 / 세로 자유
        */

        if (
            count === 1
        ) {

            createAttack(
                createdAt
            );

        }


        /*
            2개:
            반드시 가로 1 + 세로 1
        */

        else if (
            count === 2
        ) {

            createAttack(
                createdAt,
                "row"
            );


            createAttack(
                createdAt,
                "col"
            );

        }


        /*
            3개:
            가로 2 + 세로 1
            또는
            가로 1 + 세로 2
        */

        else if (
            count === 3
        ) {

            const rowHeavy =
                Math.random() < 0.5;


            if (
                rowHeavy
            ) {

                createAttack(
                    createdAt,
                    "row"
                );

                createAttack(
                    createdAt,
                    "row"
                );

                createAttack(
                    createdAt,
                    "col"
                );

            } else {

                createAttack(
                    createdAt,
                    "col"
                );

                createAttack(
                    createdAt,
                    "col"
                );

                createAttack(
                    createdAt,
                    "row"
                );

            }

        }


        return phase.spawnEveryBeats;

    }


    /* ------------------------------
       Attack Render
    ------------------------------ */

    function renderAttacks(
        now
    ) {

        const layer =
            stageElement.querySelector(
                "#judgmentAttackLayer"
            );


        if (!layer) {
            return;
        }


        layer.innerHTML =
            attacks.map(
                attack => {

                    const remaining =
                        Math.max(
                            0,
                            attack.detonateAt - now
                        );


                    const count =
                        Math.max(
                            1,
                            Math.ceil(
                                remaining
                                /
                                BEAT_DURATION
                            )
                        );


                    const dangerClass =
                        remaining <= 250
                            ? " danger"
                            : "";


                    return `
                        <div
                            class="
                                judgment-warning
                                ${attack.axis}
                                ${attack.side}
                                ${dangerClass}
                            "
                            style="
                                --attack-index:
                                ${attack.index};
                            "
                        >

                            <span
                                class="judgment-warning-line"
                            ></span>

                            <span
                                class="judgment-warning-badge"
                            >
                                ${getAttackArrow(
                        attack.side
                    )}
                                ${count}
                            </span>

                        </div>
                    `;

                }
            )
                .join("");

    }


    function getAttackArrow(side) {

        if (
            side === "left"
        ) {
            return "→";
        }


        if (
            side === "right"
        ) {
            return "←";
        }


        if (
            side === "top"
        ) {
            return "↓";
        }


        return "↑";

    }


    /* ------------------------------
       Explosion
    ------------------------------ */

    function processAttacks(
        now
    ) {

        const detonated =
            attacks.filter(
                attack =>
                    now >=
                    attack.detonateAt
            );


        if (!detonated.length) {
            return;
        }


        detonated.forEach(
            attack => {

                totalAttacks += 1;


                showExplosion(
                    attack
                );


                if (
                    isPlayerHit(
                        attack
                    )
                ) {

                    hitCount += 1;


                    playSound(
                        "wrong"
                    );


                    showPlayerHit();

                }

            }
        );


        attacks =
            attacks.filter(
                attack =>
                    now <
                    attack.detonateAt
            );


        updateHitDisplay();

    }


    function isPlayerHit(
        attack
    ) {

        /*
            이동 중에는 아직 출발 칸으로
            판정한다.
        */

        if (
            attack.axis === "row"
        ) {

            return (
                playerRow ===
                attack.index
            );

        }


        return (
            playerCol ===
            attack.index
        );

    }


    function showExplosion(
        attack
    ) {

        const board =
            getBoardElement();


        if (!board) {
            return;
        }


        const effect =
            document.createElement(
                "div"
            );


        effect.className =
            `
                judgment-explosion
                ${attack.axis}
            `;


        effect.style.setProperty(
            "--attack-index",
            attack.index
        );


        board.appendChild(
            effect
        );


        setTimeout(
            () => {

                effect.remove();

            },
            220
        );

    }


    function showPlayerHit() {

        const player =
            getPlayerElement();


        const board =
            getBoardElement();


        player?.classList.add(
            "hit"
        );


        board?.classList.add(
            "hit"
        );


        setTimeout(
            () => {

                player?.classList.remove(
                    "hit"
                );

                board?.classList.remove(
                    "hit"
                );

            },
            220
        );

    }


    /* ------------------------------
       HUD
    ------------------------------ */

    function updateTimer(
        elapsed
    ) {

        const timer =
            stageElement.querySelector(
                "#judgmentTimer"
            );


        if (!timer) {
            return;
        }


        const remaining =
            Math.max(
                0,
                GAME_DURATION - elapsed
            );


        timer.textContent =
            `${remaining.toFixed(1)}s`;

    }


    function updateHitDisplay() {

        const element =
            stageElement.querySelector(
                "#judgmentHits"
            );


        if (element) {

            element.textContent =
                `${labels.hits} ${hitCount}`;

        }

    }


    /* ------------------------------
       Start Countdown
    ------------------------------ */

    function startCountdown() {

        let count = 3;


        const message =
            stageElement.querySelector(
                "#judgmentMessage"
            );


        if (message) {

            message.textContent =
                count;

        }


        const timer =
            setInterval(
                () => {

                    count -= 1;


                    if (
                        count > 0
                    ) {

                        if (message) {

                            message.textContent =
                                count;

                        }

                        return;

                    }


                    clearInterval(
                        timer
                    );


                    if (message) {

                        message.textContent =
                            "";

                    }


                    beginGame();

                },
                650
            );

    }


    /* ------------------------------
       Game Loop
    ------------------------------ */

    function beginGame() {

        gameStarted = true;


        startTime =
            performance.now();


        nextSpawnBeat =
            0;


        animationFrame =
            requestAnimationFrame(
                loop
            );

    }


    function loop(now) {

        if (!gameRunning) {
            return;
        }


        const elapsedMs =
            now -
            startTime;


        const elapsed =
            elapsedMs
            /
            1000;


        if (
            moving &&
            now >= moveFinishTime
        ) {

            finishMove();

        }


        /*
            공격 생성 시점은
            1.5초 박자 단위로만 존재한다.
        */

        const currentBeat =
            Math.floor(
                elapsedMs
                /
                BEAT_DURATION
            );


        while (
            currentBeat >=
            nextSpawnBeat
        ) {

            const explosionBeat =
                nextSpawnBeat
                +
                ATTACK_COUNTDOWN_BEATS;


            const explosionTime =
                explosionBeat
                *
                BEAT_DURATION
                /
                1000;


            /*
                게임 종료 후 터질 공격은
                생성하지 않는다.
            */

            if (
                explosionTime >
                GAME_DURATION
            ) {

                break;

            }


            const spawnEveryBeats =
                spawnWave(
                    nextSpawnBeat
                );


            nextSpawnBeat +=
                Math.max(
                    1,
                    spawnEveryBeats
                );

        }


        processAttacks(
            now
        );


        renderAttacks(
            now
        );


        updateTimer(
            elapsed
        );


        if (
            elapsed >=
            GAME_DURATION
        ) {

            finishGame();

            return;

        }


        animationFrame =
            requestAnimationFrame(
                loop
            );

    }


    /* ------------------------------
       Score
    ------------------------------ */

    function calculateScore() {

        const BEST_HITS = 1;
        const WORST_HITS = 14;


        const normalized =
            (
                WORST_HITS -
                hitCount
            )
            /
            (
                WORST_HITS -
                BEST_HITS
            );


        return Math.round(
            Math.max(
                0,
                Math.min(
                    100,
                    normalized * 100
                )
            )
        );

    }

    /* ------------------------------
       Finish
    ------------------------------ */

    function finishGame() {

        gameRunning = false;
        gameStarted = false;


        if (
            animationFrame
        ) {

            cancelAnimationFrame(
                animationFrame
            );

        }


        attacks = [];


        renderAttacks(
            performance.now()
        );


        if (
            statusElement
        ) {

            statusElement.textContent =
                "";

        }


        onFinish({

            score:
                calculateScore(),

            hits:
                hitCount,

            totalAttacks,

            avoided:
                Math.max(
                    0,
                    totalAttacks -
                    hitCount
                )

        });

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
            options.playSound
            ||
            (() => { });


        onFinish =
            options.onFinish
            ||
            (() => { });


        labels = {
            ...labels,
            ...(options.labels || {})
        };


        const center =
            Math.floor(
                GRID_SIZE / 2
            );


        playerRow = center;
        playerCol = center;

        visualRow = center;
        visualCol = center;

        moveTargetRow = center;
        moveTargetCol = center;

        moving = false;


        attacks = [];

        nextAttackId = 1;

        hitCount = 0;
        totalAttacks = 0;


        gameRunning = true;
        gameStarted = false;


        renderBoard();

        startCountdown();

    }


    /* ------------------------------
       Public
    ------------------------------ */

    return {
        start
    };

})();