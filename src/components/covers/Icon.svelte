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

        // --EVENTS
        function icon_mouseEnter()
        {
            const
            boundingClientRect = icon.getBoundingClientRect(),
            top = boundingClientRect.top,
            left = boundingClientRect.left,
            width = boundingClientRect.width,
            height = boundingClientRect.height

            console.log(boundingClientRect)

            spring.on = false
            spring.lock = true
            spring.size.set(width)
            spring.spring_mouseMove(left + width / 2, top + height / 2)
        }

        function icon_mouseLeave()
        {
            spring.on = true
            spring.lock = false
            spring.size.set(7)
        }

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
style:width={_size}
style:height={_size}
{...(_href ? { href: _href, alt: _alt } : {})}
bind:this={icon}
>
    <slot />
</svelte:element>

<!-- #STYLE -->

<style
lang="scss"
>
    /* #IMPORT */

    @import '../../assets/scss/styles/flex.scss';

    /* #GROUP */

    .icon
    {
        @include f-center(true);

        transition: opacity 0.6s;

        pointer-events: auto;
    }
</style>