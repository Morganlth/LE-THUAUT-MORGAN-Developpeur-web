<!-- #SCRIPT -->

<script>
    // #EXPORTS

        // #PROPS
        export let
        _title,
        _content = [],
        _colors

        // #BIND

        export async function animation(x, y)
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

            translateX = x
            translateY = y

            opacity = 1
        
            update('clearRect')
        }

        export async function hidden()
        {
            context.fillStyle = _colors.dark

            setTimeout(() => opacity = 0, update('fillRect'))
        }

    // #IMPORT

        // #SVELTE
        import { onMount } from 'svelte'

    // #CONSTANTE

    const blockSize = 40

    // #VARIABLES

    let
    card,
    opacity = 0,
    width,
    height,
    translateX = 0,
    translateY = 0

    let
    canvas,
    columns,
    rows,
    context,
    even

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

        drawBackground()
    }

    function drawBackground()
    {
        context.fillStyle = _colors.dark
        context.fillRect(0, 0, width, height)
    }

    function update(action)
    {
        let delay = 0
    
        for (let y = 0; y < rows; y++)
        {
            for (let x = 0; x < columns; x += 2)
            {
                setTimeout(() =>
                {
                    context[action](x * blockSize, y * blockSize, blockSize, blockSize)
                    context[action](((even ? columns - 1 : columns) - x) * blockSize, (rows - y - 1) * blockSize, blockSize, blockSize)
                }, delay += 30)
            }
        }

        return delay
    }

    //CYCLE

    onMount(set)
</script>

<!-- #HTML -->

<section
class="card"
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
    '../../assets/scss/styles/size.scss',
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

            white-space: nowrap;
        }

        .content { padding-left: 30px; }

        p
        {
            @include font-command;

            color: $light;
            font-size: 25px;
        }
    }
</style>