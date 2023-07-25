<!-- #SCRIPT -->

<script>
    // #EXPORTS

        // --PROPS
        export let
        _blockSize = 0,
        _center = false,
        _z = 0,
        _max_width = null,
        _dark

        // --BINDS

        export let
        width = 0,
        height = 0

        // BIND tag_reset
        // BIND tag_show
        // BIND tag_hide

    // #IMPORT

        // --SVELTE
        import { onMount } from 'svelte'

    // #VARIABLES

        // --ELEMENT-TAG
        let
        tag,
        tag_TRANSLATEX = 0,
        tag_TRANSLATEY = 0,
        tag_Z = -1,
        tag_TIMEOUT = null

        // --ELEMENT-CANVAS
        let
        canvas,
        columns,
        rows,
        context,
        even

    // #FUNCTIONS

        // --SET
        function set() { tag_reset() }

        function canvas_set()
        {
            canvas.width = width
            canvas.height = height

            columns = width / _blockSize
            rows = height / _blockSize

            even = columns % 2 ? false : true

            context = context ?? canvas.getContext('2d')
        }

        // --RESET
        export async function tag_reset()
        {
            width = tag.offsetWidth + _blockSize - tag.offsetWidth % _blockSize,
            height = tag.offsetHeight + _blockSize - tag.offsetHeight % _blockSize

            canvas_set()
            tag_draw()
        }

        // --DRAW
        function tag_draw()
        {
            context.fillStyle = _dark
            context.fillRect(0, 0, columns * _blockSize, rows * _blockSize)
        }

        // --ANIMATION
        function tag_animation(action)
        {
            let delay = 0
        
            for (let y = 0; y < rows; y++)
            {
                for (let x = 0; x < columns; x += 2)
                {
                    setTimeout(() =>
                    {
                        context[action](x * _blockSize, y * _blockSize, _blockSize, _blockSize)
                        context[action](((even ? columns - 1 : columns) - x) * _blockSize, (rows - y - 1) * _blockSize, _blockSize, _blockSize)
                    }, delay += 16.67)
                }
            }
        }

        // --UTILS
        export async function tag_show(x, y, delay)
        {
            if (x != undefined || y != undefined) [tag_TRANSLATEX, tag_TRANSLATEY] = [x, y]
            
            tag_Z = 0 + _z
        
            tag_TIMEOUT = setTimeout(tag_animation.bind(null, 'clearRect'), delay ?? 0)
        }

        export async function tag_hide()
        {
            context.fillStyle = _dark
            tag_Z = -1 + _z

            clearTimeout(tag_TIMEOUT)
    
            tag_animation('fillRect')
        }

    // #CYCLE

     onMount(set)
</script>

<!-- #HTML -->

<section
class="tag"
style:top="{_center ? '50' : '0'}%"
style:left="{_center ? '50' : '0'}%"
style:z-index={tag_Z}
style:transform="translate({_center ? '-50%, -50%' : `${tag_TRANSLATEX}px, ${tag_TRANSLATEY}px`})"
style:max-width={_max_width ?? 'auto'}
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
    /* #USES */

    @use '../../assets/scss/styles/position' as *;
    @use '../../assets/scss/styles/cursor' as *;

    /* #TAG */

    .tag
    {
        @include absolute;

        display: inline-block;

        user-select: none;

        transition: transform .1s;

        canvas
        {
            @include xy-start(true);
            @include no-event;
        }
    }
</style>