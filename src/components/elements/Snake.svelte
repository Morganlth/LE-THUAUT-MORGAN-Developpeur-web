<!-- #SCRIPT -->

<script>
    // #EXPORTS

        // --PROPS
        export let
        _modes,
        _gameover,
        _snake,
        _colors

        // --BINDS
        export let
        snake_SCORE = 10,
        snake_TAIL = [0, 0]

        // BIND snake_resetSize
        // BIND snake_animation

    // #IMPORTS

        // #CONTEXTS
        import { app, event, wwindow, spring } from '../field/Main.svelte'

        // #SVELTE
        import { onMount, onDestroy } from 'svelte'

    // #CONSTANTES

        // --ELEMENT-SNAKE
        const
        SNAKE_SNAKE = [],
        SNAKE_APPLE = []

    // #VARIABLES

        // --ELEMENT-WINDOW
        let
        clientX,
        clientY

        // --ELEMENT-SNAKE
        let
        snake_X = -1,
        snake_Y = -1,
        snake_BLOCKSIZE = _snake.blockSize,
        snake_SCOPE = false, // true si snake head est à l'intérieur
        snake_OUTSIDE = true, // true si snake est entièrement à l'exterieur
        snake_OFFSET_X,
        snake_OFFSET_Y

        // --ELEMENT-CANVAS
        let
        canvas,
        columns,
        rows,
        context,
        boundingClientRect,
        width,
        height

    // #FUNCTIONS

        // --SET
        function snake_set()
        {
            snake_reset()

            context = canvas.getContext('2d')

            snake_setSnake()
            snake_setCommand()
            snake_setEvent()
        }

        function canvas_set()
        {
            canvas.width = width
            canvas.height = height

            columns = width / snake_BLOCKSIZE
            rows = height / snake_BLOCKSIZE

            boundingClientRect = canvas.getBoundingClientRect()
        }

        function snake_setApple()
        {
            let [x, y] = snake_getRandomXY()

            while (SNAKE_SNAKE.some(block => block[0] === x && block[1] === y)) [x, y] = snake_getRandomXY()

            SNAKE_APPLE[0] = x
            SNAKE_APPLE[1] = y
        }

        function snake_setSnake()
        {
            const START = Math.floor(rows / 2)
    
            for (let i = 0; i < 10; i++) SNAKE_SNAKE.push([-1 - i, START])
        }

        function snake_setCommand() { app.app_add('snake_size', snake_size, true) }

        function snake_setEvent()
        {
            event.add('mouseDown', snake_mouseDown)
            event.add('resize', snake_resize)
        }

        function snake_setEventDesktop() { event.addSeveral({ scroll: snake_scroll, mouseMove: snake_mouseMove }) }

        function snake_setScore() { snake_SCORE = SNAKE_SNAKE.length }

        // --GET
        function snake_getRandomXY() { return [Math.floor(Math.random() * (columns - 2) + 1), Math.floor(Math.random() * (rows - 2) + 1)] }

        function snake_getModel(pre, current, next)
        {
            const
            [X, Y] = [Math.abs(current[0]), Math.abs(current[1])]
            
            return [pre ? snake_getPosition(pre, X, Y) : null, snake_getPosition(next, X, Y)]
        }

        function snake_getPosition(block, x, y) { return [['a', 'b', 'c'], ['d', 'e', 'f'], ['g', 'h', 'i']][1 + (Math.abs(block[1]) - y)][1 + (Math.abs(block[0]) - x)] }

        function snake_getDimensions(model)
        {
            let [offsetX, offsetY] = [1, 1]

            for (const L of model)
                switch (L)
                {
                    case 'a':
                        offsetX = 0
                        offsetY = 0
                        break
                    case 'b':
                    case 'c':
                        offsetY = 0
                        break
                    case 'd':
                    case 'g':
                        offsetX = 0
                        break
                    default:
                        break
                }

            return [offsetX, offsetY]
        }

        // --RESET
        function snake_reset()
        {
            snake_OFFSET_X = (window.innerWidth - 1) % snake_BLOCKSIZE
            snake_OFFSET_Y = (window.innerHeight - 1) % snake_BLOCKSIZE

            width = window.innerWidth - snake_OFFSET_X
            height = window.innerHeight - snake_OFFSET_Y

            canvas_set()
            snake_setApple()
        }

        export function snake_resetSize(animation)
        {
            if (SNAKE_SNAKE.length > 10)
            {
                if (animation) snake_animation(false, 10)

                SNAKE_SNAKE.length = 10
                snake_SCORE = 10
            }
        }
    
        function resetGame() /* reset game over */
        {
            snake_updateCoords()
            snake_resetSize(false)
            snake_moveTo()
            snake_setApple()

            _gameover.update(false)

            snake_updateEvent(true)
        }
    
        // --UPDATE
        function snake_update()
        {
            const TAIL = SNAKE_SNAKE[SNAKE_SNAKE.length - 1]
    
            snake_TAIL = [TAIL[0] * snake_BLOCKSIZE, TAIL[1] * snake_BLOCKSIZE]
        
            snake_setApple()

            SNAKE_SNAKE.push([])
            
            snake_setScore()
        }

        function snake_updateCoords()
        {
            snake_X = Math.floor((clientX - boundingClientRect.left) / snake_BLOCKSIZE)
            snake_Y = Math.floor((clientY - boundingClientRect.top) / snake_BLOCKSIZE)

            snake_SCOPE = snake_X >= 0 && snake_X < columns && snake_Y >= 0 && snake_Y < rows
        }

        export function snake_updateEvent(on)
        {
            if (wwindow.window_MOBILE === false)
                on ? (snake_setEventDesktop(), boundingClientRect = canvas.getBoundingClientRect()) : snake_destroyEventDesktop()
        }

        function snake_updateInside()
        {
            if (snake_OUTSIDE) snake_OUTSIDE = false
            if (!spring.spring_LOCK) spring.spring_mouseEnter()
        }

        // --DESTROY
        function snake_destroy()
        {
            event.remove('mouseDown', snake_mouseDown)
            event.remove('resize', snake_resize)

            snake_destroyEventDesktop()
        }

        function snake_destroyEventDesktop()
        {
            event.remove('scroll', snake_scroll)
            event.remove('mouseMove', snake_mouseMove)
        }

        // --COMMAND
        function snake_size(size)
        {
            size = app.app_testDefault(size) ? _snake.blockSize : app.app_testNumber(size, 10, 70)

            snake_BLOCKSIZE = size
            localStorage.setItem('snake_size', size)
            snake_reset()
    
            app.app_success('snake size - ' + size)
        }

        // --EVENTS
        async function snake_scroll()
        {
            boundingClientRect = canvas.getBoundingClientRect()

            snake_move()
        }

        async function snake_mouseMove(x, y)
        {
            clientX = x
            clientY = y

            snake_move()
        }

        async function snake_mouseDown(e) // click pour reset apres un gameOver
        {
            if (_gameover.on && e.target.classList.contains('snake-game'))
            {
                clientX = e.clientX
                clientY = e.clientY

                resetGame()
            }
        }

        function snake_mouseLeave(e)
        {
            const target = e.relatedTarget
    
            if (spring.spring_LOCK) spring.spring_mouseLeave()
            if (target && target.classList.contains('icon')) return
            if (!_snake.invincible && !_gameover.on && _modes.challenge) _gameover.update(true)
        }

        function snake_resize(mobile)
        {
            snake_reset()

            mobile ? snake_destroyEventDesktop() : snake_setEventDesktop()
        }

        function snake_touchStart(e)
        {
            
        }

        function snake_touchMove(e)
        {
            const touch = e.changedTouches[0]

            ;[clientX, clientY] = [touch.clientX, touch.clientY]

            snake_move()
        }

        // --TEST
        function snake_test()
        {
            if (SNAKE_SNAKE[0][0] !== snake_X || SNAKE_SNAKE[0][1] !== snake_Y)
            {
                if (snake_SCOPE) snake_updateInside()
                else if (snake_OUTSIDE || snake_testOutside()) return false

                return true
            }
            else return false
        }

        function snake_testOutside()
        {
            snake_OUTSIDE = !SNAKE_SNAKE.some(block => block[0] >= 0 && block[0] < columns && block[1] >= 0 && block[1] < rows)

            return snake_OUTSIDE
        }

        function snake_testBlockBody(block)
        {
            const [X, Y] = block
    
            if (X === SNAKE_APPLE[0] && Y === SNAKE_APPLE[1]) snake_update()
    
            if (!_snake.invincible && snake_SCOPE && X === snake_X && Y === snake_Y)
                _modes.challenge ? _gameover.update(true) : (SNAKE_SNAKE.pop(), snake_setScore())
        }

        // --DRAW
        function snake_draw()
        {
            const [X, Y] = SNAKE_SNAKE[0]

            let
            [gapX, gapY] = [X - snake_X, Y - snake_Y],
            [addX, addY] = [snake_X < X ? -1 : 1, snake_Y < Y ? -1 : 1],
            i = 0

            while(i++ < 3)
            {
                if (gapX !== 0) gapX += addX
                if (gapY !== 0) gapY += addY

                snake_clear()
                snake_drawApple()
                snake_drawSnake(snake_X + gapX, snake_Y + gapY)

                if (gapX === 0 && gapY === 0) break
            }
        }

        function snake_drawApple()
        {
            context.fillStyle = _colors.indicator
            context.fillRect(SNAKE_APPLE[0] * snake_BLOCKSIZE, SNAKE_APPLE[1] * snake_BLOCKSIZE, snake_BLOCKSIZE, snake_BLOCKSIZE)
        }

        function snake_drawSnake(x, y)
        {
            context.fillStyle = _colors.oPrimary

            for (let i = SNAKE_SNAKE.length - 1; i > 0; i--)
            {
                const BLOCK = SNAKE_SNAKE[i-1]

                SNAKE_SNAKE[i] = BLOCK

                snake_testBlockBody(BLOCK)
                snake_drawBlockBody(BLOCK, i, x, y)
            }
    
            snake_drawBlockHead(x, y)
        }

        function snake_drawBlockBody(block, i, x, y)
        {
            const MODEL = snake_getModel(SNAKE_SNAKE[i + 1], block, SNAKE_SNAKE[i - 2] ?? [x, y]),
            [offsetX, offsetY] = snake_getDimensions(MODEL)

            context.fillRect(block[0] * snake_BLOCKSIZE + offsetX, block[1] * snake_BLOCKSIZE + offsetY, snake_BLOCKSIZE - offsetX, snake_BLOCKSIZE - offsetY)
        }

        function snake_drawBlockHead(x, y)
        {
            if (x === SNAKE_APPLE[0] && y === SNAKE_APPLE[1]) snake_update()

            SNAKE_SNAKE[0] = [x, y]
        
            context.fillStyle = _colors.primary
            context.fillRect(SNAKE_SNAKE[0][0] * snake_BLOCKSIZE, SNAKE_SNAKE[0][1] * snake_BLOCKSIZE, snake_BLOCKSIZE, snake_BLOCKSIZE)
        }

        // --CLEAR
        function snake_clear() { context.clearRect(0, 0, width, height) }

        // --ANIMATION
        export function snake_animation(draw, min) // dessine ou supprime de façon animé (serpent et pomme)
        {
            context.fillStyle = _colors.oPrimary

            const DELAY = snake_run(draw ? 'fillRect' : 'clearRect', min)

            if (!min) setTimeout(() => draw ? snake_drawApple() : snake_clear(), DELAY + 33.34)
        }

        // --UTILS
        function snake_run(type, min) // animation dessine le serpent de facon brut, sans les details de tailles
        {
            let delay = 0

            for (let i = SNAKE_SNAKE.length - 1; i >= (min ?? 0); i--)
            {
                const BLOCK = SNAKE_SNAKE[i]

                setTimeout(() =>
                {
                    if (i === 0) context.fillStyle = _colors.primary

                    context[type](BLOCK[0] * snake_BLOCKSIZE, BLOCK[1] * snake_BLOCKSIZE, snake_BLOCKSIZE, snake_BLOCKSIZE)
                }, delay += 16.67)
            }

            return delay
        }

        function snake_move()
        {
            snake_updateCoords()
    
            if (snake_test()) snake_draw()
        }

        function snake_moveTo() // deplace le serpent en conservant sa position initiale
        {
            const [GAPX, GAPY] = [snake_X - SNAKE_SNAKE[0][0], snake_Y - SNAKE_SNAKE[0][1]]

            for (let i = 0; i < SNAKE_SNAKE.length; i++)
            {
                const BLOCK = SNAKE_SNAKE[i]

                BLOCK[0] += GAPX
                BLOCK[1] += GAPY
            }
        }

    // #CYCLES

    onMount(snake_set)
    onDestroy(snake_destroy)
</script>

<!-- #HTML -->

<!-- svelte-ignore a11y-no-static-element-interactions -->
<div
class="snake-game"
style:height="{height}px"
style:margin="{snake_OFFSET_Y / 2}px {snake_OFFSET_X / 2}px"
on:mouseleave={snake_mouseLeave}
on:touchstart={snake_touchStart}
on:touchmove={snake_touchMove}
>
    <canvas
    style:width="{width}px"
    style:height="{height}px"
    bind:this={canvas}
    >
    </canvas>
</div>

<!-- #STYLE -->

<style
lang="scss"
>
    /* #USES */

    @use '../../assets/scss/styles/position.scss' as *;
    @use '../../assets/scss/styles/size.scss' as *;

    /* #SNAKE */

    .snake-game
    {
        @include xy-start(true);

        &::after
        {
            @include xy-start(true);
            @include any;

            content: '';

            box-shadow: inset -15px -15px 15px $dark, inset 15px 15px 15px $dark;
        }
    }
</style>