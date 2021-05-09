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
      <h1 id="no-leads" v-if="!leads || leads.length === 0">Não existem leads cadastrados.</h1>
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

export default {
  name: 'Leads',
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
    searchTerm: null,
    showCreateLead: false,
    creatingLead: false,
    createLeadModel: {
      formData: {
        leadId: null,
        name: null,
        email: null,
        phone: null,
        observations: null,
      },
      formRules: { },
    },
  }),
  methods: {
    fetch() {
      this.leads = [
        {
          id: '6063b2724837641c09edfb56',
          name: 'Rafael Nossal',
          email: 'rafael.nossal@gmail.com',
          phone: '51980247533',
          observations: 'Obs',
          createdBy: {
            name: 'Admin',
          },
        },
        {
          id: '608f3c0823301b0b0ccc029c',
          name: 'Teste',
          email: 'teste@teste.com',
          phone: '11111111111',
          observations: null,
          createdBy: {
            name: 'Admin',
          },
        },
      ];
    },
    createLead() {
      this.showCreateLead = false;
    },
    mountUpdateLead(lead) {
      this.createLeadModel.formData.leadId = lead.id;
      this.createLeadModel.formData.name = lead.name;
      this.createLeadModel.formData.email = lead.email;
      this.createLeadModel.formData.phone = lead.phone;
      this.createLeadModel.formData.observations = lead.observations;

      this.showCreateLead = true;
    },
    updateLead() {
      this.showCreateLead = false;
    },
    deleteLead(lead) {
      this.$Modal.confirm({
        title: 'Confirmação de deleção?',
        content: `Você tem certeza que deseja deletar o lead ${lead.name}?`,
        onOk: async () => {
          this.$Notice.success({
            title: 'Sucesso',
            desc: 'Lead excluído com sucesso',
          });
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
    this.fetch();
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
