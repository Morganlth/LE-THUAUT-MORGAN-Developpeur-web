<!-- #SCRIPT -->

<script>
    // #EXPORTS

        // #PROPS
        export let
        _defaultColor,
        _defeatColor,
        _playerColor,
        _aiColor

    // #IMPORTS

        // #CSS
        import '../../assets/scss/components/tictactoe.scss'

        // #COVER
        import Cell from '../covers/Cell.svelte'
        import Icon from '../covers/Icon.svelte'

        // #ICONS
        import Circle from '../icons/Circle.svelte'
        import Cross from '../icons/Cross.svelte'

    // #CONSTANTES
    
    const
    delay = 800,
    cellStyle = `
    border-top: none;
    border-right: solid ${_defaultColor} 1px;
    border-bottom: solid ${_defaultColor} 1px;
    border-left: none`,
    gameCells =
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

    let
    opacity = 1,
    borderColor = _defaultColor,
    simulationCells = [],
    tour = 0,
    difficulty = 2,
    aiTour = false,
    player = -1,
    ai = 1

    // #FUNCTIONS

    function handleClick({detail})
    {
        if (aiTour) return

        const
        datas = detail.event.currentTarget.dataset,
        [x, value] = [parseInt(datas.tictactoeCellId, 10), parseInt(datas.tictactoeCellValue, 10)]
    
        if (value) return

        aiTour = true

        newTour(x, getEmptyCells(), false)
    }

    function newTour(x, emptyCells, isAi)
    {
        tour++

        gameCells[x] = isAi ? ai : player
        simulationCells = [...gameCells]

        const result = isEndGame(emptyCells)

        result !== null ? reset(result) : isAi ? aiTour = false : aiPlayer()
    }

    function getEmptyCells()
    {
        const emptyCells = []

        for (let x = 0; x < gameCells.length; x++) if (gameCells[x] === 0) emptyCells.push(x)

        return emptyCells
    }

    function isEndGame(emptyCells, depth)
    {
        const result = isWinner()

        return (depth === 0 || result || emptyCells.length === 0) ? result : null
    }

    function aiPlayer()
    {
        const
        emptyCells = getEmptyCells(),
        depth = Math.round(Math.random()) + difficulty,
        x = tour > -1 ? run(emptyCells, depth, true, true) : emptyCells[Math.round(Math.random() * (emptyCells.length - 1))]

        newTour(x, emptyCells, true)
    }

    function minimax(emptyCells, depth, maximizingPlayer)
    {
        const result = isEndGame(emptyCells, depth)
        
        return result !== null ? result * (1 + emptyCells.length) : run(emptyCells, depth, maximizingPlayer)
    }

    function run(emptyCells, depth, maximizingPlayer, start)
    {
        let
        [value, currentPlayer, type] = maximizingPlayer ? [-Infinity, ai, 'max'] : [Infinity, player, 'min'],
        x = emptyCells[0]

        depth--

        emptyCells.forEach(cell =>
        {
            simulationCells[cell] = currentPlayer

            const
            currentEmptyCells = emptyCells.filter(c => c != cell),
            currentValue = minimax(currentEmptyCells, depth, !maximizingPlayer)

            if (start && (value < currentValue || (value === currentValue && Math.round(Math.random()))))
            {
                value = currentValue
                x = cell
            }
            else value = Math[type](currentValue, value)

            simulationCells[cell] = 0
        })

        return start ? x : value
    }

    function isWinner()
    {
        for (const model of winningModels)
        {
            const
            [a, b, c] = model,
            cellA = simulationCells[a]

            if (cellA && cellA === simulationCells[b] && cellA === simulationCells[c]) return cellA
        }

        return 0
    }

    function reset(result)
    {
        opacity = 0
        borderColor = result === player ? _playerColor : _defeatColor

        setTimeout(() =>
        {
            for (let x = 0; x < gameCells.length; x++) gameCells[x] = 0

            opacity = 1
            borderColor = _defaultColor
            tour = 0
            aiTour = false
        }, delay)
    }
</script>

<!-- #HTML -->

<div
class="tictactoe"
style:border-color={borderColor}
style:transition="border {delay / 2}ms"
>
    {#each gameCells as cell, i (i)}
        <Cell
        _data=
        {{
            'data-tictactoe-cell-id': i,
            'data-tictactoe-cell-value': cell
        }}
        _style={cellStyle}
        on:click={handleClick}
        >
            <Icon
            _opacity={opacity}
            _size="30px"
            _color={cell === ai ? _aiColor : _playerColor}
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
    @import '../../assets/scss/styles/grid.scss';

    .tictactoe
    {
        @include grid(calc(100% / 3), calc(100% / 3), 3, 3);

        width: 180px;
        height: 180px;

        border-right: solid 1px;
        border-bottom: solid 1px;
    }
</style>