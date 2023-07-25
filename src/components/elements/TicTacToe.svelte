<!-- #SCRIPT -->

<script>
    // #EXPORT

        // --PROP
        export let _colors

    // #IMPORTS

        // --CONTEXT
        import { spring } from '../field/Main.svelte'

        // --ELEMENT-COVERS
        import Cell from '../covers/Cell.svelte'
        import Icon from '../covers/Icon.svelte'

        // --ELEMENT-ICONS
        import Circle from '../icons/Circle.svelte'
        import Cross from '../icons/Cross.svelte'

    // #CONSTANTES
    
        // --ELEMENT-TICTACTOE
        const
        TICTACTOE_PLAYER = -1,
        TICTACTOE_AI = 1,
        TICTACTOE_BOARD =
        [
            0, 0, 0,
            0, 0, 0,
            0, 0, 0
        ],
        TICTACTOE_WINNING_MODELS =
        [
            [0, 1, 2],
            [3, 4, 5],
            [6, 7, 8],
            [0, 3, 6],
            [1, 4, 7],
            [2, 5, 8],
            [0, 4, 8],
            [2, 4, 6],
        ]

    // #VARIABLES

        // --ELEMENT-TICTACTOE
        let
        tictactoe_OPACITY = 1,
        tictactoe_BORDERCOLOR = _colors.sLight,
        tictactoe_SIMULATION = [],
        tictactoe_ROUND = 0,
        tictactoe_AIROUND = false

        // --ELEMENT-CELL
        let cell_STYLE = (`
            display: flex;
            justify-content: center;
            align-items: center;

            width: 100%;
            height: 100%;

            border: solid ${_colors.sLight} 1px;
            border-top: none;
            border-left: none;
        `).trim().replaceAll(/((?<=;)\s*[!^\s]|\n)/gm, '')

    // #FUNCTIONS

        // --GET
        function tictactoe_getResult(emptyCells, depth)
        {
            const RESULT = tictactoe_isWinning()

            return (depth === 0 || RESULT || !emptyCells.length) ? RESULT : null
        }

        function tictactoe_getEmptyCells()
        {
            const EMPTYCELLS = []

            for (let i = 0; i < TICTACTOE_BOARD.length; i++)
                if (!TICTACTOE_BOARD[i]) EMPTYCELLS.push(i)

            return EMPTYCELLS
        }

        // --RESET
        function tictactoe_reset(result)
        {
            tictactoe_BORDERCOLOR = _colors[result === TICTACTOE_PLAYER ? 'primary' : result === TICTACTOE_AI ? 'secondary' : 'sLight']
    
            setTimeout(() =>
            {
                tictactoe_OPACITY = 0

                setTimeout(tictactoe_resetGame, 300)
            }, 250)
        }

        function tictactoe_resetGame()
        {
            for (let i = 0; i < TICTACTOE_BOARD.length; i++) TICTACTOE_BOARD[i] = 0

            tictactoe_OPACITY = 1
            tictactoe_BORDERCOLOR = _colors.sLight
            tictactoe_ROUND = 0
            tictactoe_AIROUND = false
        }
    
        // --EVENT
        function tictactoe_click()
        {
            if (tictactoe_AIROUND || TICTACTOE_BOARD[this]) return

            tictactoe_AIROUND = true

            tictactoe_newRound(this, false)
        }

        // --UTILS
        function tictactoe_newRound(id, isAi)
        {
            tictactoe_ROUND++

            TICTACTOE_BOARD[id] = isAi ? TICTACTOE_AI : TICTACTOE_PLAYER
            tictactoe_SIMULATION = [...TICTACTOE_BOARD]

            const RESULT = tictactoe_getResult(tictactoe_getEmptyCells())

            RESULT !== null ? tictactoe_reset(RESULT) : isAi ? tictactoe_AIROUND = false : tictactoe_play()
        }

        function tictactoe_isWinning() /* return -1 || 0 || 1 */
        {
            for (const MODEL of TICTACTOE_WINNING_MODELS)
            {
                const
                [A, B, C] = MODEL,
                CELL = tictactoe_SIMULATION[A]

                if (CELL && CELL === tictactoe_SIMULATION[B] && CELL === tictactoe_SIMULATION[C]) return CELL
            }

            return 0
        }

        function tictactoe_play()
        {
            const
            EMPTYCELLS = tictactoe_getEmptyCells(),
            DEPTH = Math.round(Math.random()) + 2, /* changer la valeur pour augmenter ou diminuer la difficulté */
            ID = tictactoe_ROUND > -1 ? tictactoe_run(EMPTYCELLS, DEPTH, true, true) : EMPTYCELLS[Math.round(Math.random() * (EMPTYCELLS.length - 1))]

            tictactoe_newRound(ID, true)
        }

        function tictactoe_run(emptyCells, depth, maximizingPlayer, start)
        {
            let
            [value, currentPlayer, type] = maximizingPlayer ? [-Infinity, TICTACTOE_AI, 'max'] : [Infinity, TICTACTOE_PLAYER, 'min'],
            id = emptyCells[0]

            depth--

            for (const CELL of emptyCells)
            {
                tictactoe_SIMULATION[CELL] = currentPlayer

                const CURRENTVALUE = tictactoe_minimax(emptyCells.filter(c => c != CELL), depth, !maximizingPlayer)

                ;[value, id] = start && (value < CURRENTVALUE || (value === CURRENTVALUE && Math.round(Math.random())))
                ? [CURRENTVALUE, CELL]
                : [Math[type](CURRENTVALUE, value), id]

                tictactoe_SIMULATION[CELL] = 0
            }

            return start ? id : value
        }

        function tictactoe_minimax(emptyCells, depth, maximizingPlayer)
        {
            const RESULT = tictactoe_getResult(emptyCells, depth)
            
            return RESULT !== null ? RESULT * (1 + emptyCells.length) : tictactoe_run(emptyCells, depth, maximizingPlayer)
        }
</script>

<!-- #HTML -->

<!-- svelte-ignore a11y-no-static-element-interactions -->
<div
class="tictactoe"
style:border-color={tictactoe_BORDERCOLOR}
on:mouseenter={spring.spring_mouseEnter.bind(spring)}
on:mouseleave={spring.spring_mouseLeave.bind(spring)}
>
    {#each TICTACTOE_BOARD as cell, i (i)}
        <Cell
        _style={cell_STYLE}
        on:click={tictactoe_click.bind(i)}
        >
            <Icon
            _opacity={tictactoe_OPACITY}
            _spring={false}
            _color={cell === TICTACTOE_AI ? _colors.secondary : _colors.primary}
            >
                {#if cell === TICTACTOE_PLAYER}
                    <Circle />
                {:else if cell === TICTACTOE_AI}
                    <Cross />
                {/if}
            </Icon>
        </Cell>
    {/each}
</div>

<!-- #STYLE -->

<style
lang="scss"
>
    /* #USES */

    @use '../../assets/scss/styles/grid' as *;
    @use '../../assets/scss/styles/media' as *;

    /* #TICTACTOE */

    .tictactoe
    {
        @include grid(calc(100% / 3), calc(100% / 3), 3, 3);

        --icon-size: 18px;

        width: 100px;
        height: 100px;

        border-right: solid 1px;
        border-bottom: solid 1px;

        transition: border .4s;

        @include media-min(375px, 325px)
        {
            --icon-size: 24px;

            width: 140px;
            height: 140px;
        }
        @include media-min(425px, 585px)
        {
            --icon-size: 30px;
    
            width: 180px;
            height: 180px;
        }

        @include media-max(650px, 584px) { display: none; }
    }
</style>