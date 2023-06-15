<!-- #SCRIPT -->

<script>
    // #EXPORTS

        // #PROPS
        export let
        _title,
        _content = [],
        _blockSize = 0,
        _dark

        // #BINDS

        export let
        width = 0,
        height = 0

        export async function update(x, y)
        {
            if (timeout) { clearTimeout(timeout), callHidden = false, timeout = null }
    
            [translateX, translateY] = getPosition(x, y)
        
            setTimeout(() => { if (!callHidden) z = 0 }, animation('clearRect'))
        }

        export async function hidden()
        {
            callHidden = true

            context.fillStyle = _dark
            z = -1

            timeout = setTimeout(() => { callHidden = false, timeout = null }, animation('fillRect'))
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
    even,
    callHidden = false,
    timeout = null

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

        return delay
    }

    // #CYCLE

     onMount(set)
</script>

<!-- #HTML -->

<section
class="card"
style:z-index={z}
style:transform="translate({translateX}px, {translateY}px)"
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

        padding: 10px 20px;

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