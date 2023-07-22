<!-- #SCRIPT -->

<script>
    // #EXPORTS

        // --PROPS
        export let
        _challenge,
        _gameover,
        _invincible,
        _blockSize,
        _colors

        // --BINDS
        export let
        snake_SCORE = 10,
        snake_TAIL = [0, 0]

        // BIND snake_resetSize
        // BIND snake_resetGame
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
        window_CLIENTX,
        window_CLIENTY

        // --ELEMENT-SNAKE
        let
        snake_ON,
        snake_MOBILE,
        snake_X = -1,
        snake_Y = -1,
        snake_BLOCKSIZE = _blockSize,
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
        clientRect,
        width,
        height

    // #FUNCTIONS

        // --SET
        function snake_set()
        {
            snake_reset()

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

            context = context ?? canvas.getContext('2d')

            canvas_updateClientRect()
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

        function snake_setEvent() { event.event_add('resize', snake_resize) }

        function snake_setEventDesktop() { event.event_addSeveral({ scroll: snake_scroll, mouseMove: snake_mouseMove }) }

        function snake_setEventMobile() { if (event.event_contain('touchMove', snake_touchMove.name) === -1) event.event_add('touchMove', snake_touchMove) }

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
    
        export function snake_resetGame() // reset game over
        {
            snake_moveTo()
            snake_setApple()
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
            snake_X = Math.floor((window_CLIENTX - clientRect.left) / snake_BLOCKSIZE)
            snake_Y = Math.floor((window_CLIENTY - clientRect.top) / snake_BLOCKSIZE)

            snake_SCOPE = snake_X >= 0 && snake_X < columns - 1 && snake_Y >= 0 && snake_Y < rows - 1
        }
    
        export function snake_updateEvent(on)
        {
            const MOBILE = wwindow.window_MOBILE

            if (on !== snake_ON || MOBILE !== snake_MOBILE)
                MOBILE === false
                ? snake_updateDesktop(on)
                : snake_updateMobile(on),
                snake_ON = on,
                snake_MOBILE = MOBILE
        }

        function snake_updateDesktop(on)
        {
            if (snake_MOBILE) snake_destroyEventMobile()
    
            on
            ? snake_setEventDesktop()
            : snake_destroyEventDesktop()
        }

        function snake_updateMobile(on)
        {
            if (!snake_MOBILE) snake_destroyEventDesktop()

            on
            ? (snake_setEventMobile(), setTimeout(canvas_updateClientRect, 50))
            : snake_destroyEventMobile()
        }

        function snake_updateInside()
        {
            if (snake_OUTSIDE) snake_OUTSIDE = false
            if (!spring.spring_LOCK) spring.spring_mouseEnter()
        }

        function canvas_updateClientRect() { clientRect = canvas.getBoundingClientRect() }

        // --DESTROY
        function snake_destroy()
        {
            event.event_remove('resize', snake_resize)

            snake_destroyEventDesktop()
            snake_destroyEventMobile()
        }

        function snake_destroyEventDesktop()
        {
            event.event_remove('scroll', snake_scroll)
            event.event_remove('mouseMove', snake_mouseMove)
        }

        function snake_destroyEventMobile() { event.event_remove('touchMove', snake_touchMove) }

        // --COMMAND
        function snake_size(size)
        {
            size = app.app_testDefault(size) ? _blockSize : app.app_testNumber(size, 10, 70)

            snake_BLOCKSIZE = size
            localStorage.setItem('snake_size', size)
            snake_reset()
    
            app.app_success('snake size - ' + size)
        }

        // --EVENTS
        async function snake_scroll()
        {
            canvas_updateClientRect()

            snake_move()
        }

        async function snake_mouseMove(clientX, clientY)
        {
            [window_CLIENTX, window_CLIENTY] = [clientX, clientY]

            snake_move()
        }

        function snake_mouseLeave(e)
        {
            const target = e.relatedTarget
    
            if (spring.spring_LOCK) spring.spring_mouseLeave()
            if (target && target.classList.contains('icon')) return
        }

        async function snake_resize()
        {
            if (!wwindow.window_MOBILE) app.app_FREEZE.set(false)

            snake_reset()
        }

        async function snake_touchMove(clientX, clientY) { snake_mouseMove(clientX, clientY) }

        async function snake_touchStart(e)
        {
            if (snake_ON) return

            const TOUCH = e.changedTouches[0]
    
            ;[window_CLIENTX, window_CLIENTY] = [TOUCH.clientX, TOUCH.clientY]

            canvas_updateClientRect()
            snake_updateCoords()
        }

        // --TEST
        function snake_test()
        {
            if (SNAKE_SNAKE[0][0] !== snake_X || SNAKE_SNAKE[0][1] !== snake_Y)
            {
                if (snake_SCOPE) snake_updateInside()
                else
                {
                    if (_challenge) return _gameover.update(true)
                    if (snake_OUTSIDE || snake_testOutside()) return false
                }

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
    
            if (!_invincible && snake_SCOPE && X === snake_X && Y === snake_Y)
                _challenge ? _gameover.update(true) : (SNAKE_SNAKE.pop(), snake_setScore())
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

            // console.log(snake_X + ' - ' + snake_Y + ' ---- ' + GAPX + ' - ' + GAPY)

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