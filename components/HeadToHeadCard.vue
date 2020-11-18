<template>
  <b-collapse class="card" animation="slide" aria-id="contentIdForA11y3">
    <div
        slot="trigger" 
        slot-scope="props"
        class="card-header"
        role="button"
        aria-controls="contentIdForA11y3">
            <div class="is-flex" style="flex-direction: row">
                <a class="card-header-icon">
                    <b-icon
                        :icon="props.open ? 'menu-down' : 'menu-up'">
                    </b-icon>
                </a>
            </div>
            
        </div>
        <div class="card-content">
            <div class="content">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus nec iaculis mauris.
                <a>#buefy</a>.
            </div>
        </div>
        <footer class="card-footer">
            <a class="card-footer-item">Save</a>
            <a class="card-footer-item">Edit</a>
            <a class="card-footer-item">Delete</a>
        </footer>
    </b-collapse>
</template>

<script>
export default {
    props: ['headToHeadData']
}
</script>

<style>

</style>