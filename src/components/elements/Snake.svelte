<!-- #SCRIPT -->

<script>
    // #EXPORTS

        // --PROPS
        export let
        _size,
        _snakeParam,
        _challenge,
        _gameOver,
        _lock,
        _invincible,
        _colors

        // --BINDS
        export let
        score = 10,
        snakeTail = [0, 0]

        export function resetSnake()
        {
            if (snake.length > 10)
            {
                animation(false, 10)
                snake.length = 10
                score = 10
            }
        }

        export function animation(draw, max = -1) // dessine ou supprime de façon animé (serpent et pomme)
        {
            let delay = 0

            for (let i = snake.length - 1; i >= max; i--)
            {
                const part = i >= 0 ? snake[i] : apple

                setTimeout(() => requestAnimationFrame(() =>
                {
                    if (draw) context.fillStyle = _colors[i > 0 ? 'oPrimary' : i === 0 ? 'primary' : 'indicator']
        
                    context[draw ? 'fillRect' : 'clearRect'](part[0] * blockSize, part[1] * blockSize, blockSize, blockSize)
                }), delay += 16)
            }
        }

    // #IMPORTS

        // #CONTEXTS
        import { app } from '../field/Main.svelte'
        import { event } from '../field/Main.svelte'
        import { wwindow } from '../field/Main.svelte'
        import { spring } from '../field/Main.svelte'

        // #SVELTE
        import { onMount, onDestroy } from 'svelte'

    // #CONSTANTES

        // --ARRAY
        const
        snake = [],
        apple = []

    // #VARIABLES

        // --ELEMENT-SNAKE
        let
        canvas,
        columns,
        rows,
        context,
        boundingClientRect,
        clientX,
        clientY,
        x = -1,
        y = -1,
        blockSize = _size,
        scope = false,
        outside = true,
        snake_MOBILE,
        snake_MOBILESTART

        // --STYLES
        let
        offsetX,
        offsetY,
        width,
        height

    // #FUNCTIONS

        // --SET
        function set()
        {
            reset()

            context = canvas.getContext('2d')

            setSnake()
            setCommand()
            setEvent()
        }

        function setCanvas()
        {
            canvas.width = width
            canvas.height = height

            columns = width / blockSize
            rows = height / blockSize

            boundingClientRect = canvas.getBoundingClientRect()
        }

        function setApple()
        {
            const
            appleX = Math.floor(Math.random() * (columns - 2) + 1), // ne prend pas les bordure
            appleY = Math.floor(Math.random() * (rows - 2) + 1)

            if (snake.find(part => part[0] === appleX && part[1] === appleY)) return setApple() // probleme si snake trop grand

            apple[0] = appleX
            apple[1] = appleY
        }

        function setSnake()
        {
            const startY = Math.floor(rows / 2)
    
            for (let i = 0; i < 10; i++) snake.push([-1 - i, startY])
        }

        function setCommand() { app.add('snakeSize', snakeSize, true) }

        function setEvent()
        {
            event.add('mouseDown', snake_mouseDown)
            event.add('resize', snake_resize)

            if (!snake_MOBILE) snake_setEventDesktop()
        }

        function snake_setEventDesktop()
        {
            const DATAS = { scroll: snake_scroll, mouseMove: snake_mouseMove }
        
            for (const KEY in DATAS)
            {
                const INDEX = event.contain(KEY, DATAS[KEY].name)

                if (INDEX === -1) event.add(KEY, DATAS[KEY])
            }
        }

        // --GET
        function getModel(pre, current, next)
        {
            const
            currentX = Math.abs(current[0]),
            currentY = Math.abs(current[1])
            
            return [pre ? getPosition(pre, currentX, currentY) : null, getPosition(next, currentX, currentY)]
        }

        function getPosition(part, x, y) { return [['a', 'b', 'c'], ['d', 'e', 'f'], ['g', 'h', 'i']][1 + (Math.abs(part[1]) - y)][1 + (Math.abs(part[0]) - x)] }

        function getDimensions(model)
        {
            let
            offsetX = 1,
            offsetY = 1,
            blockWidth = blockSize - 1,
            blockHeight = blockSize - 1

            for (const m of model)
            {
                switch (m)
                {
                    case 'a':
                        offsetX = 0
                        offsetY = 0
                        break
                    case 'b':
                        offsetY = 0
                        break
                    case 'c':
                        offsetY = 0
                        blockWidth = blockSize
                        break
                    case 'd':
                        offsetX = 0
                        break
                    case 'f':
                        blockWidth = blockSize
                        break
                    case 'g':
                        offsetX = 0
                        blockHeight = blockSize
                        break
                    case 'h':
                        blockHeight = blockSize
                        break
                    case 'i':
                        blockWidth = blockSize
                        blockHeight = blockSize
                        break
                    default:
                        break
                }
            }

            return [offsetX, offsetY, blockWidth - offsetX, blockHeight - offsetY]
        }

        // --RESET
        function reset()
        {
            snake_MOBILE = wwindow.window_testMobile()

            offsetX = window.innerWidth % blockSize
            offsetY = window.innerHeight % blockSize / 2

            width = window.innerWidth - offsetX
            height = window.innerHeight - offsetY * 2

            setCanvas()
            setApple()
        }
    
        function resetGame() /* reset game over */
        {
            update()
            resetSnake()
            moveSnake()
            setApple()

            _gameOver.update(false)
        }
    
        // --UPDATE
        function update()
        {
            score = snake.length
    
            x = Math.floor((clientX - boundingClientRect.left) / blockSize)
            y = Math.floor((clientY - boundingClientRect.top) / blockSize)

            scope = x >= 0 && x < columns && y >= 0 && y < rows
        }

        function updateGamePlan()
        {
            const tail = snake[snake.length - 1]
    
            snakeTail = [tail[0] * blockSize, tail[1] * blockSize]
        
            setApple()

            snake.push([])
        }

        // --DESTROY
        function destroy()
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
        function snakeSize(size)
        {
            size = app.testDefault(size) ? _size : app.testNumber(size, 10, 70)

            blockSize = size
            localStorage.setItem('snakeSize', size)
            reset()
    
            app.success('snakeSize ' + size)
        }

        // --EVENTS
        async function snake_scroll()
        {
            boundingClientRect = canvas.getBoundingClientRect()

            move()
        }

        async function snake_mouseMove(x, y)
        {
            clientX = x
            clientY = y

            move()
        }

        async function snake_mouseDown(e) // click pour reset apres un gameOver
        {
            if (_gameOver.on && e.target.classList.contains('snake-game'))
            {
                clientX = e.clientX
                clientY = e.clientY

                resetGame()
            }
        }

        function snake_mouseLeave(e)
        {
            const target = e.relatedTarget
    
            if (spring.lock) spring.spring_mouseLeave()
            if (target && target.classList.contains('icon')) return
            if (_challenge) _gameOver.update(true)
        }

        function snake_resize(mobile)
        {
            reset()

            mobile ? snake_destroyEventDesktop() : snake_setEventDesktop()
        }

        function snake_touchStart(e)
        {
            
        }

        function snake_touchMove(e)
        {
            const touch = e.changedTouches[0]

            ;[clientX, clientY] = [touch.clientX, touch.clientY]

            move()
        }

        // --MOVE
        function move()
        {
            if (test())
            {
                update()
            
                if (check()) draw()
            }
        }

        function moveSnake() // deplace le serpent en conservant sa position initiale
        {
            const [gapX, gapY] = [x - snake[0][0], y - snake[0][1]]

            for (let i = 0; i < snake.length; i++)
            {
                const part = snake[i]

                part[0] = part[0] + gapX
                part[1] = part[1] + gapY
            }
        }

        // --TEST-CHECK
        function test()
        {
            return !(
               _lock
            || _gameOver.on
            || event.grabbing)
        }

        function check()
        {
            if (snake.length && snake[0][0] === x && snake[0][1] === y) return false
    
            if (scope) checkInside()
            else if (outside || checkOutside()) return false
    
            if (!_snakeParam) return false
    
            return true
        }

        function checkInside()
        {
            if (outside) outside = false
    
            if (!_snakeParam)
            {
                if (spring.lock) spring.spring_mouseLeave()
            }
            else if (!spring.lock) spring.spring_mouseEnter()
        }

        function checkOutside()
        {
            for (let i = 0; i < snake.length; i++)
            {
                const part = snake[i]
        
                if (part[0] >= 0 && part[0] < columns && part[1] >= 0 && part[1] < rows) return false
            }

            return outside = true
        }

        function checkSnakePart(part)
        {
            const [snakeX, snakeY] = [part[0], part[1]]
    
            if (snakeX === apple[0] && snakeY === apple[1]) updateGamePlan()
            if (!_invincible && scope && snakeX === x && snakeY === y) _challenge ? _gameOver.update(true) : snake.pop()
        }

        // --DRAW-CLEAR
        function draw()
        {
            const [snakeX, snakeY] = [snake[0][0], snake[0][1]]

            let
            gapX = snakeX - x,
            gapY = snakeY - y,
            addX = x < snakeX ? -1 : 1,
            addY = y < snakeY ? -1 : 1,
            i = 0

            while(i++ < 3)
            {
                if (gapX !== 0) gapX += addX
                if (gapY !== 0) gapY += addY

                clear()
                drawApple()
                drawSnake(x + gapX, y + gapY)

                if (gapX === 0 && gapY === 0) break
            }
        }

        function clear() { context.clearRect(0, 0, width, height) }

        function drawApple()
        {
            context.fillStyle = _colors.indicator
            context.fillRect(apple[0] * blockSize, apple[1] * blockSize, blockSize, blockSize)
        }

        function drawSnake(x, y)
        {
            context.fillStyle = _colors.oPrimary

            for (let i = snake.length - 1; i > 0; i--)
            {
                snake[i] = snake[i-1]

                const part = snake[i]

                checkSnakePart(part)
                drawSnakeBody(part, i, x, y)
            }

            drawSnakeHead(x, y)
        }

        function drawSnakeBody(part, i, x, y)
        {
            const
            pre = snake[i+1],
            next = snake[i-2] ?? [x, y],
            model = getModel(pre, part, next),
            [offsetX, offsetY, blockWidth, blockHeight] = getDimensions(model)

            context.fillRect(part[0] * blockSize + offsetX, part[1] * blockSize + offsetY, blockWidth, blockHeight)
        }

        function drawSnakeHead(x, y)
        {
            if (x === apple[0] && y === apple[1]) updateGamePlan()

            snake[0] = [x, y]
        
            context.fillStyle = _colors.primary
            context.fillRect(snake[0][0] * blockSize, snake[0][1] * blockSize, blockSize, blockSize)
        }

    // #CYCLES

    onMount(set)
    onDestroy(destroy)
</script>

<!-- #HTML -->

<!-- svelte-ignore a11y-no-static-element-interactions -->
<div
class="snake-game"
style:height="{height}px"
style:margin="{offsetY}px {offsetX}px {offsetY}px 0"
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
    /* #IMPORTS */

    @import
    '../../assets/scss/styles/position.scss',
    '../../assets/scss/styles/size.scss';

    /* #GROUPS */

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