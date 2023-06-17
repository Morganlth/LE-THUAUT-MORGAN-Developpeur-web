<!-- #SCRIPT -->

<script>
    // #EXPORTS

        // #PROPS
        export let
        _blockSize = 0,
        _start = true,
        _dark

        // #BINDS

        export let
        width = 0,
        height = 0

        export async function update(x, y, delay)
        {
            [translateX, translateY] = getPosition(x, y)
            z = 0
        
            setTimeout(() => animation('clearRect'), delay ?? 0)
        }

        export async function hidden()
        {
            context.fillStyle = _dark
            z = -1

            animation('fillRect')
        }

    // #IMPORT

        // #SVELTE
        import { onMount } from 'svelte'

    // #VARIABLES

    let
    card,
    translateX = 0,
    translateY = 0,
    z = -1

    let
    canvas,
    columns,
    rows,
    context,
    even

    // #FUNCTIONS

    function set()
    {
        width = card.offsetWidth + _blockSize - card.offsetWidth % _blockSize,
        height = card.offsetHeight + _blockSize - card.offsetHeight % _blockSize

        setCanvas()
    }

    function setCanvas()
    {
        canvas.width = width
        canvas.height = height

        columns = width / _blockSize
        rows = height / _blockSize

        context = canvas.getContext('2d')

        even = columns % 2 ? false : true

        context.fillStyle = _dark
        context.fillRect(0, 0, columns * _blockSize, rows * _blockSize)
    }

    function getPosition(x, y)
    {
        const
        w = window.innerWidth,
        h = window.innerHeight

        if (x < _blockSize) x = _blockSize
        else
        {
            const xAndWidth = x + width + _blockSize

            if (xAndWidth > w) x -= xAndWidth - w
        }
        
        if (y < _blockSize) y = _blockSize
        else
        {
            const yAndHeight = y + height + _blockSize

            if (yAndHeight > h) y -= yAndHeight - h
        }

        return [x, y]
    }

    function animation(action)
    {
        let delay = 0
    
        for (let y = 0; y < rows; y++)
        {
            for (let x = 0; x < columns; x += 2)
            {
                setTimeout(() =>
                {
                    requestAnimationFrame(() =>
                    {
                        context[action](x * _blockSize, y * _blockSize, _blockSize, _blockSize)
                        context[action](((even ? columns - 1 : columns) - x) * _blockSize, (rows - y - 1) * _blockSize, _blockSize, _blockSize)
                    })
                }, delay += 16)
            }
        }
    }

    // #CYCLE

     onMount(set)
</script>

<!-- #HTML -->

<section
class="card"
style:z-index={z}
style:transform="translate({_start ? `${translateX}px, ${translateY}px` : '-50%, -50%'})"
style={_start ? 'top: 0; left: 0' : 'top: 50%; left: 50%'}
bind:this={card}
>
    <slot />

    <canvas
    style:width="{width}px"
    style:height="{height}px"
    bind:this={canvas}
    >
    </canvas>
</section>

<!-- #STYLE -->

<style
lang="scss"
>
    /* #IMPORT */

    @import '../../assets/scss/styles/position.scss';

    /* #GROUP */

    .card
    {
        @include absolute;

        display: inline-block;

        padding: 10px 20px;

        transition: transform .1s;

        canvas { @include xy-start(true); }
    }
</style>