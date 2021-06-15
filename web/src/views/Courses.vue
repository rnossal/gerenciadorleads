<template>
  <div class="courses">
    <Content :style="{padding: '20px 50px'}">
      <h1>Lista de Cursos</h1>
      <Divider />
      <Card class="courses-actions" :dis-hover="true">
        <Button
          type="primary"
          class="action-button"
          @click="showCreateCourse = true"
        >Criar curso</Button>
        <Input
          search
          enter-button
          v-model="searchTerm"
          @on-search="fetch"
          placeholder="Pesquisar..."
        />
      </Card>
      <Divider />
      <div
        id="courses-list"
        v-if="courses && courses.length > 0"
      >
        <Card dis-hover>
          <Table
            id="courses-table"
            ref="coursesTable"
            :columns="coursesColumns"
            :data="courses"
            stripe
            border
          >
            <template slot-scope="{ row }" slot="actions">
              <Row
                type="flex"
                justify="center"
                :gutter="5"
              >
                <i-col>
                  <Button
                    type="primary"
                    @click="mountUpdateCourse(row)"
                    :style="{ width: '75px' }"
                  >Editar</Button>
                </i-col>
                <i-col>
                  <Button
                    type="error"
                    @click="deleteCourse(row)"
                    :style="{ width: '75px' }"
                  >Excluir</Button>
                </i-col>
              </Row>
            </template>
          </Table>
        </Card>
      </div>
      <h1 id="no-courses" v-else>Não existem cursos cadastrados.</h1>
    </Content>
    <Modal
      v-model="showCreateCourse"
      title="Criar curso"
      :closable="!creatingCourse"
      :mask-closable="!creatingCourse"
      @on-visible-change="modalClosed"
      @submit.native.prevent
    >
      <div>
        <i-form
          ref="create-course-form"
          :model="createCourseModel.formData"
          :rules="createCourseModel.formRules"
          :disabled="creatingCourse"
        >
          <FormItem prop="name" label="Nome">
            <Input v-model="createCourseModel.formData.name" />
          </FormItem>
        </i-form>
      </div>
      <div slot="footer">
        <Button @click="showCreateCourse = false" :disabled="creatingCourse">Cancelar</Button>
        <Button
          type="primary"
          :loading="creatingCourse"
          @click="createCourseModel.formData.courseId === null ? createCourse() : updateCourse()"
        >{{createCourseModel.formData.courseId === null ? 'Criar' : 'Atualizar'}}</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
import handleError from '@/mixins/handleError';
import { courses } from '@/assets/config';

export default {
  name: 'Courses',
  mixins: [handleError],
  data: () => ({
    courses: [],
    coursesColumns: [
      {
        title: 'Nome',
        key: 'name',
        ellipsis: true,
        minWidth: 250,
      },
      {
        title: 'Ações',
        slot: 'actions',
        align: 'center',
        width: 195,
      },
    ],
    searchTerm: null,
    showCreateCourse: false,
    creatingCourse: false,
    createCourseModel: {
      formData: {
        courseId: null,
        name: null,
      },
      formRules: {
        name: [
          {
            required: true,
            message: 'Informe o nome',
            trigger: 'blur',
          },
        ],
      },
    },
  }),
  methods: {
    async fetch() {
      let graphqlResponse = null;

      try {
        const response = await this.$http.get(courses.methods.get, {
          params: {
            query: `{
              courses (
                name: "${this.searchTerm ? this.searchTerm : ''}",
              ) {
                id
                name
              }
            }`,
          },
        });

        graphqlResponse = response.data;
      } catch (e) {
        this.handleError('Falha ao listar os cursos disponíveis', e);

        return;
      }

      if (graphqlResponse) {
        if (graphqlResponse.errors) {
          this.handleError('Falha ao listar os cursos disponíveis', graphqlResponse);
        } else {
          this.courses = graphqlResponse.data.courses;
        }
      } else {
        this.handleError('Falha ao listar os cursos disponíveis', 'Sem resposta do servidor');
      }
    },
    async createCourse() {
      if (!await this.$refs['create-course-form'].validate()) return;

      this.creatingCourse = true;

      try {
        await this.$http.post(
          courses.methods.post,
          {
            name: this.createCourseModel.formData.name,
            email: this.createCourseModel.formData.email,
            phone: this.createCourseModel.formData.phone,
            observations: this.createCourseModel.formData.observations,
            coursesOfInterest: this.createCourseModel.formData.coursesOfInterest,
          },
        );
      } catch (e) {
        this.handleError('Falha ao criar o curso', e);

        this.creatingCourse = false;

        return;
      }

      this.fetch();

      this.creatingCourse = false;
      this.showCreateCourse = false;
    },
    mountUpdateCourse(course) {
      this.createCourseModel.formData.courseId = course.id;
      this.createCourseModel.formData.name = course.name;

      this.showCreateCourse = true;
    },
    async updateCourse() {
      if (!await this.$refs['create-course-form'].validate()) return;

      this.creatingCourse = true;

      try {
        await this.$http.put(
          courses.methods.update,
          {
            courseId: this.createCourseModel.formData.courseId,
            name: this.createCourseModel.formData.name,
          },
        );
      } catch (e) {
        this.handleError('Falha ao atualizar o curso', e);

        this.creatingCourse = false;

        return;
      }

      this.fetch();

      this.creatingCourse = false;
      this.showCreateCourse = false;
    },
    async deleteCourse(course) {
      this.$Modal.confirm({
        title: 'Confirmação de deleção',
        content: `Você tem certeza que deseja deletar o curso ${course.name}?`,
        onOk: async () => {
          try {
            const body = {
              courseId: course.id,
            };
            const response = await this.$http.delete(courses.methods.delete, { data: body });

            if (response.data.deleted) {
              this.fetch();

              this.$Notice.success({
                title: 'Sucesso',
                desc: 'Curso excluído com sucesso',
              });
            } else {
              this.handleError('Falha ao excluir o curso.');
            }
          } catch (e) {
            this.handleError('Falha ao excluir o curso.', e);
          }
        },
        okText: 'Excluir',
      });
    },
    modalClosed(shown) {
      if (!shown) {
        this.createCourseModel.formData.courseId = null;
        this.createCourseModel.formData.name = null;
      }
    },
  },
  beforeMount() {
    this.$Spin.show();
  },
  async mounted() {
    await this.fetch();
    this.$Spin.hide();
  },
};
</script>

<style lang="less">
.courses-actions {
  .ivu-card-body {
    display: flex;
  }
}

.lead-card {
  margin-bottom: 20px;
}

#no-courses {
  text-align: center;
}

.lead-actions {
  display: grid !important;
}

.lead-action {
  margin-bottom: 5px !important;
}

#table-actions {
  display: flex;
  margin-bottom: 15px;
}

#export-table-btn {
  margin-left: auto;
}
</style>
