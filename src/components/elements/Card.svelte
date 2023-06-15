<!-- #SCRIPT -->

<script>
    // #EXPORTS

        // #PROPS
        export let
        _title,
        _content = [],
        _dark

        // #BINDS

        export let
        width = 0,
        height = 0

        export async function update(x, y)
        {
            if (timeout)
            {
                clearTimeout(timeout)
                timeout = null
            }
            else if (frameId)
            {
                cancelAnimationFrame(frameId)
                frameId = null
            }

            [translateX, translateY] = getPosition(x, y)
            opacity = 1
        
            setTimeout(() => z = 0, animation('clearRect'))
        }

        export async function hidden()
        {
            context.fillStyle = _dark
            z = -1

            timeout = setTimeout(() =>
            {
                timeout = null
    
                fade()
            }, animation('fillRect'))
        }

    // #IMPORT

        // #SVELTE
        import { onMount } from 'svelte'

    // #CONSTANTE

    const blockSize = 40

    // #VARIABLES

    let
    card,
    translateX = 0,
    translateY = 0,
    z = -1,
    opacity = 0

    let
    canvas,
    columns,
    rows,
    context,
    even,
    timeout = null,
    frameId = null

    // #FUNCTIONS

    function set()
    {
        width = card.offsetWidth + blockSize - card.offsetWidth % blockSize,
        height = card.offsetHeight + blockSize - card.offsetHeight % blockSize

        setCanvas()
    }

    function setCanvas()
    {
        canvas.width = width
        canvas.height = height

        columns = width / blockSize
        rows = height / blockSize

        context = canvas.getContext('2d')

        even = columns % 2 ? false : true

        context.fillStyle = _dark
        context.fillRect(0, 0, columns * blockSize, rows * blockSize)
    }

    function getPosition(x, y)
    {
        const
        w = window.innerWidth,
        h = window.innerHeight

        if (x < blockSize) x = blockSize
        else
        {
            const xAndWidth = x + width + blockSize

            if (xAndWidth > w) x -= xAndWidth - w
        }
        
        if (y < blockSize) y = blockSize
        else
        {
            const yAndHeight = y + height + blockSize

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
                        context[action](x * blockSize, y * blockSize, blockSize, blockSize)
                        context[action](((even ? columns - 1 : columns) - x) * blockSize, (rows - y - 1) * blockSize, blockSize, blockSize)
                    })
                }, delay += 30)
            }
        }

        return delay
    }

    function fade()
    {
        opacity -= 0.1

        opacity > 0 ? frameId = requestAnimationFrame(fade) : opacity = 0
    }

    // #CYCLE

     onMount(set)
</script>

<!-- #HTML -->

<section
class="card"
style:z-index={z}
style:transform="translate({translateX}px, {translateY}px)"
style:opacity={opacity}
bind:this={card}
>
    <h3>{_title}</h3>

    <div
    class="content"
    >
        {#each _content as text}
            <p>{text}</p>
        {/each}
    </div>

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
    /* #IMPORTS */

    @import
    '../../assets/scss/styles/position.scss',
    '../../assets/scss/styles/background.scss',
    '../../assets/scss/styles/font.scss';

    /* #GROUPS */

    .card
    {
        @include black-glass(hue-rotate(180deg));

        display: inline-block;

        padding-top: 20px;

        &,
        canvas
        { @include xy-start(true); }
    
        h3
        {
            @include title-3($o-primary);

            padding-right: 30px;

            white-space: nowrap;
        }

        .content
        {
            margin: 10px 0 0 30px;
            padding: 10px 0 0 30px;

            border-top: solid 1px $o-primary;
        }

        p
        {
            @include text-command;

            color: $light;
        }
    }
</style>