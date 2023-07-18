<!-- #SCRIPT -->

<script>
    // #EXPORTS

        // --PROPS
        export let
        _blockSize = 0,
        _start = true,
        _dark

        // --BINDS

        export let
        width = 0,
        height = 0

        export async function reset()
        {
            width = tag.offsetWidth + _blockSize - tag.offsetWidth % _blockSize,
            height = tag.offsetHeight + _blockSize - tag.offsetHeight % _blockSize

            setCanvas()
            drawBackground()
        }

        export async function view(x, y, delay)
        {
            [translateX, translateY] = getPosition(x, y)
            z = 0
        
            timeout = setTimeout(() =>
            {
                timeout = null
    
                animation('clearRect')
            }, delay ?? 0)
        }

        export async function hidden()
        {
            context.fillStyle = _dark
            z = -1

            if (timeout) clearTimeout(timeout), timeout = null
    
            animation('fillRect')
        }

    // #IMPORT

        // --SVELTE
        import { onMount } from 'svelte'

    // #VARIABLES

        // --ELEMENT-TAG
        let
        tag,
        translateX = 0,
        translateY = 0,
        z = -1,
        timeout = null

        // --ELEMENT-CANVAS
        let
        canvas,
        columns,
        rows,
        context,
        even

    // #FUNCTIONS

        // --SET
        function set() { reset() }

        function setCanvas()
        {
            canvas.width = width
            canvas.height = height

            columns = width / _blockSize
            rows = height / _blockSize

            even = columns % 2 ? false : true

            context = context ?? canvas.getContext('2d')
        }

        // --GET
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

        // --DRAW
        function drawBackground()
        {
            context.fillStyle = _dark
            context.fillRect(0, 0, columns * _blockSize, rows * _blockSize)
        }

        // --ANIMATION
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
class="tag"
style:z-index={z}
style:transform="translate({_start ? `${translateX}px, ${translateY}px` : '-50%, -50%'})"
style={_start ? 'top: 0; left: 0' : 'top: 50%; left: 50%'}
bind:this={tag}
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
    /* #USE */

    @use '../../assets/scss/styles/position.scss' as *;

    /* #TAG */

    .tag
    {
        @include absolute;

        display: inline-block;

        padding: 10px 20px;

        transition: transform .1s;

        canvas { @include xy-start(true); }
    }
</style>