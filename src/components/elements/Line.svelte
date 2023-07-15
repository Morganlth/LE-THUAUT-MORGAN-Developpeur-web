<!-- #SCRIPT -->

<script>
    // #EXPORTS

        // --PROPS
        export let
        _type,
        _msg
</script>

<!-- #HTML -->

<div class="line">
    <div class="line-content">
        {#if _type}
            <span class="console-{_type}">{_msg.name}:</span>
            <pre class="console-result">{_msg.message}</pre>
        {:else}
            <pre class="console-result">{_msg}</pre>
        {/if}
    </div>
</div>