<template>
  <div class="leads">
    <Content :style="{padding: '20px 50px'}">
      <h1>Lista de Leads</h1>
      <Divider />
      <Card class="leads-actions" :dis-hover="true">
        <Button
          type="primary"
          class="action-button"
          @click="showCreateLead = true"
        >Criar lead</Button>
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
        id="leads-list"
        v-if="leads && leads.length > 0"
      >
        <Card
          v-if="reportView"
          dis-hover
        >
          <div id="table-actions">
            <Button
              id="export-table-btn"
              type="success"
              @click="exportTable"
            >
              Exportar dados
              <Icon type="ios-grid"></Icon>
            </Button>
          </div>
          <Table
            ref="leadsTable"
            :columns="leadsColumns"
            :data="leads"
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
                    @click="mountUpdateLead(row)"
                    :style="{ width: '75px' }"
                  >Editar</Button>
                </i-col>
                <i-col>
                  <Button
                    type="error"
                    @click="deleteLead(row)"
                    :style="{ width: '75px' }"
                  >Excluir</Button>
                </i-col>
              </Row>
            </template>
          </Table>
        </Card>
        <Card
          v-else
          class="lead-card"
          v-for="leadItem in leads"
          :key="leadItem.id"
          dis-hover
        >
          <p slot="title">{{leadItem.name}}</p>
          <Row>
            <Col span="20">
              <p><b>Email: </b>{{leadItem.email}}</p>
              <p v-if="leadItem.phone"><b>Telefone: </b>{{leadItem.phone}}</p>
              <p v-if="leadItem.createdBy"><b>Criador por: </b>{{leadItem.createdBy.name}}</p>
              <p v-if="leadItem.observations"><b>Observações: </b>{{leadItem.observations}}</p>
            </Col>
            <Col class="lead-actions" span="4">
              <Button
                class="lead-action"
                type="primary"
                @click="mountUpdateLead(leadItem)"
              >Editar</Button>
              <Button
                class="lead-action"
                type="error"
                @click="deleteLead(leadItem)"
              >Excluir</Button>
            </Col>
          </Row>
        </Card>
      </div>
      <h1 id="no-leads" v-else>Não existem leads cadastrados.</h1>
    </Content>
    <Modal
      v-model="showCreateLead"
      title="Criar lead"
      :closable="!creatingLead"
      :mask-closable="!creatingLead"
      @on-visible-change="modalClosed"
    >
      <div>
        <i-form
          ref="create-lead-form"
          :model="createLeadModel.formData"
          :rules="createLeadModel.formRules"
          :disabled="creatingLead"
        >
          <FormItem prop="name" label="Nome">
            <Input v-model="createLeadModel.formData.name" />
          </FormItem>
          <FormItem prop="email" label="Email">
            <Input type="email" v-model="createLeadModel.formData.email" />
          </FormItem>
          <FormItem prop="phone" label="Telefone">
            <Input v-model="createLeadModel.formData.phone" />
          </FormItem>
          <FormItem prop="coursesOfInterest" label="Cursos de interesse">
            <Select v-model="createLeadModel.formData.coursesOfInterest" multiple>
              <Option
                v-for="course in courses"
                :value="course.id"
                :key="course.id"
              >{{ course.name }}</Option>
            </Select>
          </FormItem>
          <FormItem prop="observations" label="Observações">
            <Input type="textarea" v-model="createLeadModel.formData.observations" />
          </FormItem>
        </i-form>
      </div>
      <div slot="footer">
        <Button @click="showCreateLead = false" :disabled="creatingLead">Cancelar</Button>
        <Button
          type="primary"
          :loading="creatingLead"
          @click="createLeadModel.formData.leadId === null ? createLead() : updateLead()"
        >{{createLeadModel.formData.leadId === null ? 'Criar' : 'Atualizar'}}</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
import LeadTableInfo from '@/components/Leads/LeadTableInfo.vue';
import handleError from '@/mixins/handleError';
import { leads, courses } from '@/assets/config';

export default {
  name: 'Leads',
  mixins: [handleError],
  data: () => ({
    reportView: true,
    leadsColumns: [
      {
        type: 'expand',
        width: 40,
        render: (h, params) => h(LeadTableInfo, {
          props: {
            row: params.row,
          },
        }),
      },
      {
        title: 'Nome',
        key: 'name',
        ellipsis: true,
      },
      {
        title: 'E-mail',
        key: 'email',
        ellipsis: true,
      },
      {
        title: 'Telefone',
        key: 'phone',
        ellipsis: true,
      },
      {
        title: 'Observações',
        key: 'observations',
        ellipsis: true,
      },
      {
        title: 'Ações',
        slot: 'actions',
        align: 'center',
      },
    ],
    leadsExportColumns: [
      {
        title: 'Nome',
        key: 'name',
      },
      {
        title: 'E-mail',
        key: 'email',
      },
      {
        title: 'Telefone',
        key: 'phone',
      },
      {
        title: 'Observações',
        key: 'observations',
      },
      {
        title: 'Criado por',
        key: 'createdBy.name',
      },
    ],
    leads: [],
    courses: [],
    searchTerm: null,
    showCreateLead: false,
    creatingLead: false,
    createLeadModel: {
      formData: {
        leadId: null,
        name: null,
        email: null,
        phone: null,
        coursesOfInterest: [],
        observations: null,
      },
      formRules: {
        name: [
          {
            required: true,
            message: 'Informe o nome',
            trigger: 'blur',
          },
        ],
        email: [
          {
            required: true,
            message: 'Informe o email',
            trigger: 'blur',
          },
          {
            type: 'email',
            message: 'Email em formato incorreto',
            trigger: 'blur',
          },
        ],
        phone: [
          {
            required: true,
            message: 'Informe o número de telefone',
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
        const response = await this.$http.get(leads.methods.get, {
          params: {
            query: `{
              leads (
                name: "${this.searchTerm ? this.searchTerm : ''}",
                email: "${this.searchTerm ? this.searchTerm : ''}",
                phone: "${this.searchTerm ? this.searchTerm : ''}",
                observations: "${this.searchTerm ? this.searchTerm : ''}"
              ) {
                id
                name
                email
                phone
                coursesOfInterest {
                  id
                  name
                }
                observations
                createdBy {
                  name
                }
              }
            }`,
          },
        });

        graphqlResponse = response.data;
      } catch (e) {
        this.handleError('Falha ao listar os leads', e);

        return;
      }

      if (graphqlResponse) {
        if (graphqlResponse.errors) {
          this.handleError('Falha ao listar os leads', graphqlResponse);
        } else {
          this.leads = graphqlResponse.data.leads;
        }
      } else {
        this.handleError('Falha ao listar os leads', 'Sem resposta do servidor');
      }
    },
    async fetchCourses() {
      let graphqlResponse = null;

      try {
        const response = await this.$http.get(courses.methods.get, {
          params: {
            query: `{
              courses {
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
    async createLead() {
      if (!await this.$refs['create-lead-form'].validate()) return;

      this.creatingLead = true;

      try {
        await this.$http.post(
          leads.methods.post,
          {
            name: this.createLeadModel.formData.name,
            email: this.createLeadModel.formData.email,
            phone: this.createLeadModel.formData.phone,
            observations: this.createLeadModel.formData.observations,
            coursesOfInterest: this.createLeadModel.formData.coursesOfInterest,
          },
        );
      } catch (e) {
        this.handleError('Falha ao criar o lead', e);

        this.creatingLead = false;

        return;
      }

      this.fetch();

      this.creatingLead = false;
      this.showCreateLead = false;
    },
    mountUpdateLead(lead) {
      this.createLeadModel.formData.leadId = lead.id;
      this.createLeadModel.formData.name = lead.name;
      this.createLeadModel.formData.email = lead.email;
      this.createLeadModel.formData.phone = lead.phone;
      this.createLeadModel.formData.coursesOfInterest = [];
      if (lead.coursesOfInterest) {
        this.createLeadModel.formData.coursesOfInterest = lead.coursesOfInterest.map((c) => c.id);
      }
      this.createLeadModel.formData.observations = lead.observations;

      this.showCreateLead = true;
    },
    async updateLead() {
      if (!await this.$refs['create-lead-form'].validate()) return;

      this.creatingLead = true;

      try {
        await this.$http.put(
          leads.methods.update,
          {
            leadId: this.createLeadModel.formData.leadId,
            name: this.createLeadModel.formData.name,
            email: this.createLeadModel.formData.email,
            phone: this.createLeadModel.formData.phone,
            coursesOfInterest: this.createLeadModel.formData.coursesOfInterest,
            observations: this.createLeadModel.formData.observations,
          },
        );
      } catch (e) {
        this.handleError('Falha ao atualizar o lead', e);

        this.creatingLead = false;

        return;
      }

      this.fetch();

      this.creatingLead = false;
      this.showCreateLead = false;
    },
    async deleteLead(lead) {
      this.$Modal.confirm({
        title: 'Confirmação de deleção?',
        content: `Você tem certeza que deseja deletar o lead ${lead.name}?`,
        onOk: async () => {
          try {
            const body = {
              leadId: lead.id,
            };
            const response = await this.$http.delete(leads.methods.delete, { data: body });

            if (response.data.deleted) {
              this.fetch();

              this.$Notice.success({
                title: 'Sucesso',
                desc: 'Lead excluído com sucesso',
              });
            } else {
              this.handleError('Falha ao excluir a turma.');
            }
          } catch (e) {
            this.handleError('Falha ao excluir a turma.', e);
          }
        },
        okText: 'Excluir',
      });
    },
    modalClosed(shown) {
      if (!shown) {
        this.createLeadModel.formData.leadId = null;
        this.createLeadModel.formData.name = null;
        this.createLeadModel.formData.email = null;
        this.createLeadModel.formData.phone = null;
        this.createLeadModel.formData.coursesOfInterest = [];
        this.createLeadModel.formData.observations = null;
      }
    },
    exportTable() {
      const leadsData = this.leads.map((l) => this.$flattenObject(l));

      this.$refs.leadsTable.exportCsv({
        filename: 'leads',
        columns: this.leadsExportColumns,
        data: leadsData,
      });
    },
  },
  beforeMount() {
    this.$Spin.show();
  },
  async mounted() {
    await this.fetchCourses();
    await this.fetch();
    this.$Spin.hide();
  },
};
</script>

<style lang="less">
.leads-actions {
  .ivu-card-body {
    display: flex;
  }
}

.lead-card {
  margin-bottom: 20px;
}

#no-leads {
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
