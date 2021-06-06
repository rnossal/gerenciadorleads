<template>
  <div class="leads">
    <Content :style="{padding: '20px 50px'}">
      <h1>Lista de Leads</h1>
      <Divider />
      <Card class="leads-actions" :dis-hover="true">
        <div id="lead-search">
          <Button
            type="primary"
            class="action-button"
            @click="showCreateLead = true"
          >Criar lead</Button>
        </div>
        <br />
        <div>
          <Collapse simple>
            <Panel name="1">
              Filtros
              <div slot="content" id="filter-content">
                <i-form
                  :model="searchLeadModel.formData"
                  :disabled="creatingLead"
                  @submit.native.prevent
                >
                  <FormItem prop="searchTerm" label="Nome / E-mail / Telefone / Observações">
                    <!-- <Input
                      search
                      enter-button
                      v-model="searchLeadModel.formData.searchTerm"
                      @on-search="fetch"
                      placeholder="Pesquisar..."
                    /> -->
                    <Input
                      search
                      v-model="searchLeadModel.formData.searchTerm"
                      placeholder="Pesquisar..."
                    />
                  </FormItem>
                  <FormItem prop="coursesOfInterest" label="Cursos de interesse">
                    <Select v-model="searchLeadModel.formData.coursesOfInterest" multiple>
                      <Option
                        v-for="course in courses"
                        :value="course.id"
                        :key="course.id"
                      >{{ course.name }}</Option>
                    </Select>
                  </FormItem>
                  <FormItem>
                    <Button id="clear-filters" @click="clearSearch">Limpar filtros</Button>
                    <Button @click="fetch" type="primary">Pesquisar</Button>
                  </FormItem>
                </i-form>
              </div>
            </Panel>
          </Collapse>
        </div>
      </Card>
      <Divider />
      <div
        id="leads-list"
        v-if="leads && leads.length > 0"
      >
        <Card
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
            id="leads-table"
            ref="leadsTable"
            :columns="leadsColumns"
            :data="leads"
            stripe
            border
          >
            <template slot-scope="{ row }" slot="status">
              <Badge :color="statuses[row.status].color" :text="statuses[row.status].text">
              </Badge>
            </template>
            <template slot-scope="{ row }" slot="actions">
              <Row
                class="actions-row"
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
              <Row
                class="actions-row"
                type="flex"
                justify="center"
                :gutter="5"
              >
                <i-col>
                  <Button
                    type="info"
                    @click="showFollowUp(row.id)"
                  >Acompanhamentos</Button>
                </i-col>
              </Row>
            </template>
          </Table>
        </Card>
      </div>
      <h1 id="no-leads" v-else>Não existem leads cadastrados.</h1>
    </Content>
    <Modal
      v-model="showCreateLead"
      title="Criar lead"
      :closable="!creatingLead"
      :mask-closable="!creatingLead"
      @on-visible-change="createLeadModalClosed"
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
            <CInput
              v-model="createLeadModel.formData.phone"
              :mask="['(##) ####-####', '(##) #####-####']"
            />
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
    <Modal
      v-model="showFollowUpModal"
      @on-visible-change="followUpModalClosed"
      class-name="follow-up-modal"
      title="Acompanhamentos"
      width="700"
      footer-hide
    >
      <div class="follow-up-modal-header" slot="header">
        <div class="follow-up-modal-header-left">
          <Button
            type="primary"
            icon="md-add"
            @click="showAddFollowUpModal = true"
          >Registrar</Button>
        </div>
        <div class="follow-up-modal-header-center">
          <div>
            <p>Acompanhamentos</p>
          </div>
        </div>
        <div class="follow-up-modal-header-right"></div>
      </div>
      <div class="follow-up">
        <Timeline
          v-if="lead && lead.followUpHistory && lead.followUpHistory.length > 0"
        >
          <TimelineItem
            v-for="history in lead.followUpHistory"
            :key="history.id"
            :color="statuses[history.status].color"
          >
            <p class="time">
              <!-- eslint-disable-next-line max-len -->
              ({{statuses[history.status].text}}) {{moment(history.createdAt).format('DD/MM/YYYY HH:mm:ss')}} - {{history.createdBy.name}}
            </p>
            <p class="content">{{history.description}}</p>
          </TimelineItem>
        </Timeline>
        <h2 id="no-leads" v-else>Nenhum acompanhamento registrado.</h2>
      </div>
    </Modal>
    <Modal
      v-model="showAddFollowUpModal"
      title="Registrar acompanhamento"
      :closable="!addingFollowUp"
      :mask-closable="!addingFollowUp"
      @on-visible-change="addFollowUpModalClosed"
    >
      <div>
        <i-form
          ref="add-follow-up-form"
          :model="addFollowUpModel.formData"
          :rules="addFollowUpModel.formRules"
          :disabled="addingFollowUp"
        >
          <FormItem prop="status" label="Status">
            <Select v-model="addFollowUpModel.formData.status">
              <Option
                v-for="(status, key) in statuses"
                :value="key"
                :key="key"
              >{{ status.text }}</Option>
            </Select>
          </FormItem>
          <FormItem prop="description" label="Descrição">
            <Input type="textarea" v-model="addFollowUpModel.formData.description" />
          </FormItem>
        </i-form>
      </div>
      <div slot="footer">
        <Button @click="showAddFollowUpModal = false" :disabled="addingFollowUp">Cancelar</Button>
        <Button
          type="primary"
          :loading="addingFollowUp"
          @click="addFollowUp()"
        >Registrar</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
import CInput from '@/components/CInput.vue';
import LeadTableInfo from '@/components/Leads/LeadTableInfo.vue';
import handleError from '@/mixins/handleError';
import arrayObjectAttributeToText from '@/mixins/arrayObjectAttributeToText';
import { leads, courses } from '@/assets/config';

export default {
  name: 'Leads',
  mixins: [handleError, arrayObjectAttributeToText],
  components: {
    CInput,
  },
  data: () => ({
    statuses: {
      0: {
        color: 'gray',
        text: 'Nenhum',
      },
      1: {
        color: '#52c41a',
        text: 'Interessado',
      },
      2: {
        color: '#f5222d',
        text: 'Sem interesse',
      },
      3: {
        color: '#fadb14',
        text: 'A contatar',
      },
    },
    leads: [],
    lead: null,
    courses: [],
    showCreateLead: false,
    creatingLead: false,
    showFollowUpModal: false,
    showAddFollowUpModal: false,
    addingFollowUp: false,
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
        title: 'Status',
        slot: 'status',
        ellipsis: true,
        minWidth: 150,
        maxWidth: 150,
      },
      {
        title: 'Nome',
        key: 'name',
        ellipsis: true,
        minWidth: 150,
      },
      {
        title: 'E-mail',
        key: 'email',
        ellipsis: true,
        minWidth: 150,
      },
      {
        title: 'Telefone',
        key: 'phone',
        ellipsis: true,
        minWidth: 150,
      },
      {
        title: 'Observações',
        key: 'observations',
        ellipsis: true,
        minWidth: 150,
      },
      {
        title: 'Ações',
        slot: 'actions',
        align: 'center',
        width: 195,
      },
    ],
    leadsExportColumns: [
      {
        title: 'Status',
        key: 'status',
      },
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
        title: 'Cursos de interesse',
        key: 'coursesOfInterest',
      },
      {
        title: 'Observações',
        key: 'observations',
      },
      {
        title: 'Criado por',
        key: 'createdBy',
      },
    ],
    searchLeadModel: {
      formData: {
        searchTerm: null,
        coursesOfInterest: [],
      },
    },
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
    addFollowUpModel: {
      formData: {
        status: null,
        description: null,
      },
      formRules: {
        status: [
          {
            required: true,
            message: 'Informe um status',
            trigger: 'blur',
          },
        ],
        description: [
          {
            required: true,
            message: 'Informe a descrição',
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
                name: "${this.searchLeadModel.formData.searchTerm ? this.searchLeadModel.formData.searchTerm : ''}",
                email: "${this.searchLeadModel.formData.searchTerm ? this.searchLeadModel.formData.searchTerm : ''}",
                phone: "${this.searchLeadModel.formData.searchTerm ? this.searchLeadModel.formData.searchTerm : ''}",
                observations: "${this.searchLeadModel.formData.searchTerm ? this.searchLeadModel.formData.searchTerm : ''}"
                coursesOfInterest: []
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
                status
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
    async fetchLead(leadId) {
      let graphqlResponse = null;

      try {
        const response = await this.$http.get(leads.methods.get, {
          params: {
            query: `{
              lead (
                id: "${leadId}",
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
                status
                followUpHistory {
                  id,
                  status,
                  description
                  createdAt
                  createdBy {
                    name
                  }
                }
              }
            }`,
          },
        });

        graphqlResponse = response.data;
      } catch (e) {
        this.handleError('Falha ao recuperar o lead', e);

        return;
      }

      if (graphqlResponse) {
        if (graphqlResponse.errors) {
          this.handleError('Falha ao recuperar o lead', graphqlResponse);
        } else {
          this.lead = graphqlResponse.data.lead;
          if (Array.isArray(this.lead?.followUpHistory)) {
            this.lead.followUpHistory.sort(
              (a, b) => this.moment(b.createdAt) - this.moment(a.createdAt),
            );
          }
        }
      } else {
        this.handleError('Falha ao recuperar o lead', 'Sem resposta do servidor');
      }
    },
    clearSearch() {
      this.searchLeadModel.formData.searchTerm = null;
      this.searchLeadModel.formData.coursesOfInterest = [];

      this.fetch();
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

      await this.fetch();

      this.creatingLead = false;
      this.showCreateLead = false;
    },
    async addFollowUp() {
      if (!await this.$refs['add-follow-up-form'].validate()) return;

      this.addingFollowUp = true;

      try {
        await this.$http.post(
          leads.methods.followUp,
          {
            leadId: this.lead.id,
            description: this.addFollowUpModel.formData.description,
            status: this.addFollowUpModel.formData.status,
          },
        );
      } catch (e) {
        this.handleError('Falha ao adicionar o acompanhamento', e);

        this.addingFollowUp = false;

        return;
      }

      await this.fetch();
      await this.fetchLead(this.lead.id);

      this.addingFollowUp = false;
      this.showAddFollowUpModal = false;
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

      await this.fetch();

      this.creatingLead = false;
      this.showCreateLead = false;
    },
    async deleteLead(lead) {
      this.$Modal.confirm({
        title: 'Confirmação de deleção',
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
              this.handleError('Falha ao excluir o lead.');
            }
          } catch (e) {
            this.handleError('Falha ao excluir o lead.', e);
          }
        },
        okText: 'Excluir',
      });
    },
    createLeadModalClosed(shown) {
      if (!shown) {
        this.createLeadModel.formData.leadId = null;
        this.createLeadModel.formData.name = null;
        this.createLeadModel.formData.email = null;
        this.createLeadModel.formData.phone = null;
        this.createLeadModel.formData.coursesOfInterest = [];
        this.createLeadModel.formData.observations = null;
      }
    },
    followUpModalClosed(shown) {
      if (!shown) {
        this.lead = null;
      }
    },
    addFollowUpModalClosed(shown) {
      if (!shown) {
        this.addFollowUpModel.formData.description = null;
        this.addFollowUpModel.formData.status = null;
      }
    },
    exportTable() {
      const leadsData = this.leads.map((l) => ({
        status: this.statuses[l.status].text,
        name: l.name,
        email: l.email,
        phone: l.phone,
        coursesOfInterest: this.arrayObjectAttributeToText(l.coursesOfInterest, 'name'),
        observations: l.observations ?? '',
        createdBy: l.createdBy.name,
      }));

      this.$refs.leadsTable.exportCsv({
        filename: 'leads',
        columns: this.leadsExportColumns,
        data: leadsData,
        quoted: true,
      });
    },
    async showFollowUp(leadId) {
      this.$Spin.show();
      await this.fetchLead(leadId);
      this.$Spin.hide();

      this.showFollowUpModal = true;
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
  #lead-search {
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

#clear-filters {
  margin-right: 5px;
}

#filter-content {
  user-select: none;
}

.actions-row {
  margin: 5px 0;
}

.follow-up {
  margin-top: 10px;
  margin-left: 8px;
}

.time{
  font-size: 14px;
  font-weight: bold;
}

.content{
  padding-left: 5px;
}

.follow-up-modal{
  display: flex;
  align-items: center;
  justify-content: center;

  .ivu-modal{
    top: 0;
    max-height: 100vh;

    .ivu-modal-body {
      max-height: 80vh;
      overflow-y: auto;
      word-break: break-all;
    }
  }
}

.follow-up-modal-header {
  display: flex;

  * {
    user-select: none;
  }
}

.follow-up-modal-header-left,
.follow-up-modal-header-center,
.follow-up-modal-header-right {
  display: flex;
  align-items: center;
  flex-grow: 1;
  flex-shrink: 1;
  flex-basis: 100%;
}

.follow-up-modal-header-center {
  text-align: center;
  div {
    width: 100%;
    height: 35px;
    display: flex;
    align-items: center;
  }
}

@media (max-width: 576px) {
  .follow-up-modal-header {
    flex-direction: column-reverse;
  }

  .follow-up-modal-header-left,
  .follow-up-modal-header-center,
  .follow-up-modal-header-right {
    justify-content: center;
  }
}
</style>
