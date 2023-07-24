<!-- #SCRIPT -->

<script>
    // #EXPORTS

        // --PROPS
        export let
        _transform = '',
        _opacity = 1,
        _size = null,
        _color = '#FFF',
        _href = null,
        _alt = null,
        _title= null,
        _spring = true

    // #IMPORTS

        // --SCSS
        import '../../assets/scss/components/icon.scss'

        // --CONTEXT
        import { spring } from '../field/Main.svelte'

        // --SVELTE
        import { onMount } from 'svelte'

    // #VARIABLE

        // --ELEMENT-ICON
        let icon

    // #FUNCTIONS

        // --SET
        function icon_set()
        {
            if (_spring)
            {
                icon.addEventListener('mouseenter', icon_mouseEnter)
                icon.addEventListener('mouseleave', icon_mouseLeave)
            }
        }

        // --UPDATE
        function icon_springUpdate(lock, hover, size)
        {
            spring.spring_LOCK = lock
            spring.spring_HOVER = hover
            spring.spring_SIZE.set(size)
        }

        // --EVENTS
        function icon_mouseEnter()
        {
            if (spring.spring_ON)
            {
                const
                BOUNDINGCLIENTRECT = icon.getBoundingClientRect(),
                X = BOUNDINGCLIENTRECT.left + BOUNDINGCLIENTRECT.width / 2,
                Y = BOUNDINGCLIENTRECT.top + BOUNDINGCLIENTRECT.height / 2

                icon_springUpdate(true, true, BOUNDINGCLIENTRECT.width)
        
                requestAnimationFrame(() => spring.spring_setPosition(X, Y))
            }
        }

        function icon_mouseLeave() { if (spring.spring_ON) icon_springUpdate(false, false, 7) }

    // #CYCLE

    onMount(icon_set)
</script>

<!-- #HTML -->

<svelte:element
this={_href ? 'a' : 'div'}
class="icon"
style:--icon-color={_color}
style:transform={_transform}
style:opacity={_opacity}
style:width={_size ?? 'var(--icon-size, auto)'}
style:height={_size ?? 'var(--icon-size, auto)'}
{...(_href ? { href: _href, alt: _alt } : {})}
{...(_title ? { title: _title } : {})}
bind:this={icon}
>
    <slot />
</svelte:element>

<!-- #STYLE -->

<style
lang="scss"
>
    /* #USE */

    @use '../../assets/scss/styles/flex' as *;

    /* #ICON */

    .icon
    {
        @include f-center(true);

        box-sizing: border-box;

        transition: opacity .3s;

        pointer-events: auto;
    }
</style>