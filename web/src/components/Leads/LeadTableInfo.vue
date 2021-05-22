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
  computed: {
    coursesOfInterest() {
      let coursesOfInterest = '';

      if (this.row.coursesOfInterest) {
        this.row.coursesOfInterest.forEach((course, index) => {
          const deviceName = course.name;

          if ((this.row.coursesOfInterest.length - 2) > index) {
            coursesOfInterest += `${deviceName}, `;
          } else if ((this.row.coursesOfInterest.length - 1) > index) {
            coursesOfInterest += `${deviceName} e `;
          } else {
            coursesOfInterest += deviceName;
          }
        });
      }

      return coursesOfInterest;
    },
  },
};
</script>
