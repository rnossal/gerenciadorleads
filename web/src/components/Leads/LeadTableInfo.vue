<template>
  <div class="lead-table-info">
    <List>
      <ListItem>
        <ListItemMeta title="Nome" :description="row.name" />
      </ListItem>
      <ListItem>
        <ListItemMeta title="E-email" :description="row.email" />
      </ListItem>
      <ListItem>
        <ListItemMeta title="Telefone" :description="row.phone" />
      </ListItem>
      <ListItem v-if="coursesOfInterest">
        <ListItemMeta title="Cursos de interesse" :description="coursesOfInterest" />
      </ListItem>
      <ListItem v-if="row.observations">
        <ListItemMeta title="Observações" :description="row.observations" />
      </ListItem>
      <ListItem>
        <ListItemMeta
          title="Criado por"
          :description="
          (row.createdBy && row.createdBy.name) ?
            row.createdBy.name :
            'Usuário removido'"
        />
      </ListItem>
    </List>
  </div>
</template>

<script>
import arrayObjectAttributeToText from '@/mixins/arrayObjectAttributeToText';

export default {
  name: 'LeadTableInfo',
  mixins: [arrayObjectAttributeToText],
  props: {
    row: Object,
  },
  computed: {
    coursesOfInterest() {
      return this.arrayObjectAttributeToText(this.row.coursesOfInterest, 'name');
    },
  },
};
</script>
