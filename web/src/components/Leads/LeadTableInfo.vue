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
      <ListItem>
        <ListItemMeta title="Criado por" :description="row.createdBy.name" />
      </ListItem>
      <ListItem>
        <ListItemMeta title="Observações" :description="row.observations" />
      </ListItem>
    </List>
  </div>
</template>

<script>
export default {
  name: 'LeadTableInfo',
  props: {
    row: Object,
  },
};
</script>
