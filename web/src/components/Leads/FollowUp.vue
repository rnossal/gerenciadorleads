<template>
  <div class="follow-up">
    <Timeline
      v-if="lead && lead.followUpHistory"
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
  </div>
</template>

<script>
import { leads } from '@/assets/config';

export default {
  name: 'FollowUp',
  props: {
    leadId: String,
  },
  data: () => ({
    lead: null,
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
  }),
  methods: {
    async fetch() {
      let graphqlResponse = null;

      try {
        const response = await this.$http.get(leads.methods.get, {
          params: {
            query: `{
              lead (
                id: "${this.leadId}",
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
</style>
