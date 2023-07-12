<!-- #SCRIPT -->

<script>
    // #EXPORTS

        // --PROPS
        export let
        _transform = '',
        _opacity = 1, /*tictactoe*/
        _size = null,
        _href = null,
        _alt = null,
        _spring = true,
        _color = '#fff'

    // #IMPORTS

        // --SCSS
        import '../../assets/scss/components/icon.scss'

        // --CONTEXT
        import { spring } from '../field/Main.svelte'

        // --SVELTE
        import { onMount } from 'svelte'

    // #VARIABLES

        // --ELEMENT-ICON
        let icon

    // #FUNCTIONS

        // --SET
        function set()
        {
            if (_spring)
            {
                icon.addEventListener('mouseenter', icon_mouseEnter)
                icon.addEventListener('mouseleave', icon_mouseLeave)
            }
        }

        // --UPDATE
        function update(on, lock, hover, size)
        {
            spring.on = on
            spring.lock = lock
            spring.hover = hover
            spring.size.set(size)
        }

        // --EVENTS
        function icon_mouseEnter()
        {
            const
            boundingClientRect = icon.getBoundingClientRect(),
            x = boundingClientRect.left + boundingClientRect.width / 2,
            y = boundingClientRect.top + boundingClientRect.height / 2

            update(false, true, true, boundingClientRect.width)
    
            requestAnimationFrame(() => spring.setPosition(x, y))
        }

        function icon_mouseLeave() { update(true, false, false, 7) }

    // #CYCLE

    onMount(set)
</script>

<!-- #HTML -->

<svelte:element
this={_href ? 'a' : 'div'}
class="icon"
style:--icon-color={_color}
style:transform={_transform}
style:opacity={_opacity}
style:width={_size ?? 'auto'}
style:height={_size ?? 'auto'}
{...(_href ? { href: _href, alt: _alt } : {})}
bind:this={icon}
>
    <slot />
</svelte:element>

<!-- #STYLE -->

<style
lang="scss"
>
    /* #USE */

    @use '../../assets/scss/styles/flex.scss' as *;

    /* #GROUP */

    .icon
    {
        @include f-center(true);

        transition: opacity 0.6s;

        pointer-events: auto;
    }
</style>