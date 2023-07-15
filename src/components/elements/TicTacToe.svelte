<!-- #SCRIPT -->

<script>
    // #EXPORT

        // --PROP
        export let _colors

    // #IMPORTS

        // --SCSS
        import '../../assets/scss/components/tictactoe.scss'

        // --CONTEXT
        import { spring } from '../field/Main.svelte'

        // --ELEMENT-COVER
        import Cell from '../covers/Cell.svelte'
        import Icon from '../covers/Icon.svelte'

        // --ELEMENT-ICONS
        import Circle from '../icons/Circle.svelte'
        import Cross from '../icons/Cross.svelte'

    // #CONSTANTES
    
        // #PLAYERS
        const
        player = -1,
        ai = 1

        // #GAME-BOARD
        const
        board =
        [
            0, 0, 0,
            0, 0, 0,
            0, 0, 0
        ],
        winningModels =
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

        // --STYLES
        let
        opacity = 1,
        borderColor = _colors.sLight

        // --GAME-INFOS
        let
        simulation = [],
        tour = 0,
        aiTour = false

    // #FUNCTIONS

        // --CYCLE
        function reset(result)
        {
            opacity = 0
            borderColor = _colors[result === player ? 'primary' : result === ai ? 'secondary' : 'dark']

            setTimeout(() =>
            {
                for (let i = 0; i < board.length; i++) board[i] = 0

                opacity = 1
                borderColor = _colors.sLight
                tour = 0
                aiTour = false
            }, 500)
        }

        // --GET
        function getResult(emptyCells, depth)
        {
            const result = isWinning()

            return (depth === 0 || result || !emptyCells.length) ? result : null
        }

        function getEmptyCells()
        {
            const emptyCells = []

            for (let i = 0; i < board.length; i++)
                if (!board[i]) emptyCells.push(i)

            return emptyCells
        }

        // --EVENT
        function click(id)
        {
            if (aiTour || board[id]) return

            aiTour = true

            newTour(id, false)
        }

        // --GAME-CODE
        function newTour(id, isAi)
        {
            tour++

            board[id] = isAi ? ai : player
            simulation = [...board]

            const
            emptyCells = getEmptyCells(),
            result = getResult(emptyCells)

            result !== null ? reset(result) : isAi ? aiTour = false : play()
        }

        function isWinning() /* return -1 || 0 || 1 */
        {
            for (const model of winningModels)
            {
                const
                [a, b, c] = model,
                cell = simulation[a]

                if (cell && cell === simulation[b] && cell === simulation[c]) return cell
            }

            return 0
        }

        function play()
        {
            const
            emptyCells = getEmptyCells(),
            depth = Math.round(Math.random()) + 2, /* changer la valeur pour augmenter ou diminuer la difficulté */
            i = tour > -1 ? run(emptyCells, depth, true, true) : emptyCells[Math.round(Math.random() * (emptyCells.length - 1))]

            newTour(i, emptyCells, true)
        }

        function run(emptyCells, depth, maximizingPlayer, start)
        {
            let
            [value, currentPlayer, type] = maximizingPlayer ? [-Infinity, ai, 'max'] : [Infinity, player, 'min'],
            i = emptyCells[0]

            depth--

            for (const cell of emptyCells)
            {
                simulation[cell] = currentPlayer

                const
                currentEmptyCells = emptyCells.filter(c => c != cell),
                currentValue = minimax(currentEmptyCells, depth, !maximizingPlayer)

                if (start && (value < currentValue || (value === currentValue && Math.round(Math.random()))))
                {
                    value = currentValue
                    i = cell
                }
                else value = Math[type](currentValue, value)

                simulation[cell] = 0
            }

            return start ? i : value
        }

        function minimax(emptyCells, depth, maximizingPlayer)
        {
            const result = getResult(emptyCells, depth)
            
            return result !== null ? result * (1 + emptyCells.length) : run(emptyCells, depth, maximizingPlayer)
        }
</script>

<!-- #HTML -->

<!-- svelte-ignore a11y-no-static-element-interactions -->
<div
class="tictactoe"
style:border-color={borderColor}
on:mouseenter={spring.spring_mouseEnter.bind(spring)}
on:mouseleave={spring.spring_mouseLeave.bind(spring)}
>
    {#each board as cell, i (i)}
        <Cell
        _style="border: solid {_colors.sLight} 1px; border-top: none; border-left: none"
        on:click={click.bind(null, i)}
        >
            <Icon
            _opacity={opacity}
            _size="30px"
            _spring={false}
            _color={cell === ai ? _colors.secondary : _colors.primary}
            >
                {#if cell === player}
                    <Circle />
                {:else if cell === ai}
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

        width: 120px;
        height: 120px;

        border-right: solid 1px;
        border-bottom: solid 1px;

        transition: border .25s; /* reset() timeout delay / 2 */

        @include media-min(375px, 325px)
        {
            width: 150px;
            height: 150px;
        }
        @include media-min(425px, 585px)
        {
            width: 180px;
            height: 180px;
        }

        @include media-max(650px, 584px) { display: none; }
    }
</style>