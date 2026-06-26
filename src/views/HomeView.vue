<script setup lang="ts">
import { computed, ref } from 'vue'

const dateRanges = ['Last 7 days', 'Last 30 days', 'Last 90 days'] as const

type DateRange = (typeof dateRanges)[number]

const selectedRange = ref<DateRange>(dateRanges[1])

const rangeData: Record<DateRange, {
  shipmentSeries: number[]
  totalShipments: string
  onTime: string
  exceptions: string
  support: string
  orders: Array<{ id: string; origin: string; destination: string; expected: string; delivered: string; status: string }>
  regions: Array<{ name: string; rate: number; deliveries: number }>
}> = {
  'Last 7 days': {
    shipmentSeries: [95, 110, 132, 128, 155, 170, 160],
    totalShipments: '1,840',
    onTime: '92%',
    exceptions: '14',
    support: '6 tickets',
    orders: [
      {
        id: 'FF-1003',
        origin: 'Chicago, IL',
        destination: 'Atlanta, GA',
        expected: '2026-07-02',
        delivered: '2026-07-01',
        status: 'Delivered',
      },
      {
        id: 'FF-1004',
        origin: 'Los Angeles, CA',
        destination: 'Dallas, TX',
        expected: '2026-07-04',
        delivered: '2026-07-05',
        status: 'Late',
      },
      {
        id: 'FF-1005',
        origin: 'Newark, NJ',
        destination: 'Miami, FL',
        expected: '2026-07-06',
        delivered: '2026-07-06',
        status: 'Delivered',
      },
      {
        id: 'FF-1006',
        origin: 'Seattle, WA',
        destination: 'Denver, CO',
        expected: '2026-07-03',
        delivered: '2026-07-03',
        status: 'Delivered',
      },
    ],
    regions: [
      { name: 'North America', rate: 94, deliveries: 540 },
      { name: 'Midwest', rate: 91, deliveries: 320 },
      { name: 'South', rate: 88, deliveries: 270 },
      { name: 'West', rate: 96, deliveries: 190 },
    ],
  },
  'Last 30 days': {
    shipmentSeries: [120, 135, 142, 153, 170, 162, 155],
    totalShipments: '7,420',
    onTime: '90%',
    exceptions: '38',
    support: '12 tickets',
    orders: [
      {
        id: 'FF-1087',
        origin: 'Phoenix, AZ',
        destination: 'Houston, TX',
        expected: '2026-06-30',
        delivered: '2026-06-29',
        status: 'Delivered',
      },
      {
        id: 'FF-1088',
        origin: 'Boston, MA',
        destination: 'Chicago, IL',
        expected: '2026-07-02',
        delivered: '2026-07-03',
        status: 'Late',
      },
      {
        id: 'FF-1089',
        origin: 'Denver, CO',
        destination: 'Seattle, WA',
        expected: '2026-07-04',
        delivered: '2026-07-04',
        status: 'Delivered',
      },
      {
        id: 'FF-1090',
        origin: 'Miami, FL',
        destination: 'Newark, NJ',
        expected: '2026-07-05',
        delivered: '2026-07-05',
        status: 'Delivered',
      },
    ],
    regions: [
      { name: 'North America', rate: 92, deliveries: 2_100 },
      { name: 'Midwest', rate: 89, deliveries: 1_180 },
      { name: 'South', rate: 87, deliveries: 950 },
      { name: 'West', rate: 94, deliveries: 720 },
    ],
  },
  'Last 90 days': {
    shipmentSeries: [110, 123, 145, 138, 160, 178, 172],
    totalShipments: '18,900',
    onTime: '89%',
    exceptions: '62',
    support: '18 tickets',
    orders: [
      {
        id: 'FF-1112',
        origin: 'Dallas, TX',
        destination: 'Boston, MA',
        expected: '2026-06-28',
        delivered: '2026-06-29',
        status: 'Late',
      },
      {
        id: 'FF-1113',
        origin: 'Atlanta, GA',
        destination: 'Chicago, IL',
        expected: '2026-07-01',
        delivered: '2026-07-01',
        status: 'Delivered',
      },
      {
        id: 'FF-1114',
        origin: 'San Francisco, CA',
        destination: 'Denver, CO',
        expected: '2026-07-03',
        delivered: '2026-07-03',
        status: 'Delivered',
      },
      {
        id: 'FF-1115',
        origin: 'Miami, FL',
        destination: 'Seattle, WA',
        expected: '2026-07-05',
        delivered: '2026-07-05',
        status: 'Delivered',
      },
    ],
    regions: [
      { name: 'North America', rate: 91, deliveries: 5_800 },
      { name: 'Midwest', rate: 87, deliveries: 3_100 },
      { name: 'South', rate: 85, deliveries: 2_600 },
      { name: 'West', rate: 93, deliveries: 1_900 },
    ],
  },
}

const currentData = computed(() => rangeData[selectedRange.value])
const shipmentSeries = computed(() => currentData.value.shipmentSeries)
const orders = computed(() => currentData.value.orders)
const regions = computed(() => currentData.value.regions)

const cards = computed(() => [
  {
    title: 'Shipment volume',
    value: currentData.value.totalShipments,
    detail: 'Total shipments in period',
  },
  {
    title: 'On-time delivery',
    value: currentData.value.onTime,
    detail: 'Percentage of orders delivered on time',
  },
  {
    title: 'Open exceptions',
    value: currentData.value.exceptions,
    detail: 'Active exception cases',
  },
  {
    title: 'Pending support',
    value: currentData.value.support,
    detail: 'Support requests awaiting response',
  },
])

const ticket = ref('')
const submitStatus = ref('')

const submitTicket = () => {
  if (!ticket.value.trim()) {
    submitStatus.value = 'Please describe your issue before submitting.'
    return
  }

  submitStatus.value = `Ticket submitted: ${ticket.value.slice(0, 60)}${ticket.value.length > 60 ? '...' : ''}`
  ticket.value = ''
}
</script>

<template>
  <main class="dashboard">
    <section class="hero">
      <div>
        <p class="eyebrow">Executive dashboard</p>
        <h1>FastForward Logistics</h1>
        <p class="subheader">
          Track shipment volume, delivery performance, and regional operations with a single view.
        </p>
      </div>

      <div class="filter-panel">
        <label for="dateRange">Date range</label>
        <select id="dateRange" v-model="selectedRange">
          <option v-for="range in dateRanges" :key="range" :value="range">{{ range }}</option>
        </select>
      </div>
    </section>

    <section class="cards-grid">
      <article v-for="card in cards" :key="card.title" class="metric-card">
        <span class="metric-label">{{ card.title }}</span>
        <strong>{{ card.value }}</strong>
        <p>{{ card.detail }}</p>
      </article>
    </section>

    <section class="dashboard-grid">
      <div class="panel chart-panel">
        <div class="panel-header">
          <div>
            <h2>Volume of shipments</h2>
            <p>Daily volume for the selected period</p>
          </div>
          <span class="badge">{{ selectedRange }}</span>
        </div>

        <div class="chart">
          <div class="chart-axis">
            <span>0</span>
            <span>50</span>
            <span>100</span>
            <span>150</span>
            <span>200</span>
          </div>
          <div class="chart-bars">
            <div
              v-for="(value, index) in shipmentSeries"
              :key="index"
              class="chart-bar"
              :style="{ height: `${value}%` }"
            >
              <span>{{ value }}</span>
            </div>
          </div>
        </div>
      </div>

      <div class="panel region-panel">
        <div class="panel-header">
          <h2>Regional performance</h2>
          <p>Delivery rates across the network</p>
        </div>

        <div class="region-list">
          <article v-for="region in regions" :key="region.name" class="region-card">
            <div>
              <h3>{{ region.name }}</h3>
              <p>{{ region.deliveries }} deliveries</p>
            </div>
            <strong>{{ region.rate }}%</strong>
          </article>
        </div>
      </div>

      <div class="panel table-panel">
        <div class="panel-header">
          <h2>Recent orders</h2>
          <p>Orders and deliveries with expected and delivered dates</p>
        </div>

        <table>
          <thead>
            <tr>
              <th>Order</th>
              <th>Origin</th>
              <th>Destination</th>
              <th>Expected</th>
              <th>Delivered</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="order in orders" :key="order.id">
              <td>{{ order.id }}</td>
              <td>{{ order.origin }}</td>
              <td>{{ order.destination }}</td>
              <td>{{ order.expected }}</td>
              <td>{{ order.delivered }}</td>
              <td :class="order.status === 'Late' ? 'tag-late' : 'tag-on-time'">{{ order.status }}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="panel ticket-panel">
        <div class="panel-header">
          <h2>Support ticket</h2>
          <p>Submit an operational issue to the logistics team</p>
        </div>

        <div class="ticket-form">
          <label for="ticketText">Issue description</label>
          <textarea id="ticketText" v-model="ticket" placeholder="Describe the problem or exception"></textarea>
          <button type="button" @click="submitTicket">Submit ticket</button>
          <p class="ticket-status" v-if="submitStatus">{{ submitStatus }}</p>
        </div>
      </div>
    </section>
  </main>
</template>

<style scoped>
.dashboard {
  display: grid;
  gap: 2rem;
  color: #0b2140;
}

.hero {
  display: grid;
  gap: 1.5rem;
  padding: 2rem;
  border-radius: 28px;
  background: radial-gradient(circle at top left, rgba(53, 116, 255, 0.24), transparent 36%),
    linear-gradient(180deg, rgba(15, 75, 255, 0.12), rgba(12, 34, 76, 0.05));
  box-shadow: 0 32px 80px rgba(30, 77, 255, 0.08);
}

.eyebrow {
  display: inline-flex;
  font-size: 0.85rem;
  font-weight: 700;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: #1553d6;
  margin-bottom: 0.65rem;
}

.hero h1 {
  font-size: clamp(2.3rem, 3vw, 4rem);
  line-height: 1.02;
  margin-bottom: 0.9rem;
}

.subheader {
  max-width: 56rem;
  font-size: 1.03rem;
  color: #274169;
}

.filter-panel {
  align-self: end;
  justify-self: start;
  display: grid;
  gap: 0.75rem;
  min-width: 200px;
}

.filter-panel label {
  font-size: 0.9rem;
  color: #42648f;
}

.filter-panel select {
  border: none;
  border-radius: 16px;
  padding: 0.9rem 1rem;
  background: rgba(255, 255, 255, 0.88);
  box-shadow: inset 0 1px 2px rgba(16, 52, 113, 0.08);
  color: #0f2f60;
}

.cards-grid {
  display: grid;
  gap: 1rem;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
}

.metric-card {
  padding: 1.6rem;
  border-radius: 24px;
  background: rgba(255, 255, 255, 0.9);
  box-shadow: 0 24px 60px rgba(13, 52, 117, 0.06);
  border: 1px solid rgba(56, 111, 235, 0.14);
  transition: transform 0.25s ease, box-shadow 0.25s ease;
}

.metric-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 32px 70px rgba(13, 52, 117, 0.1);
}

.metric-label {
  display: inline-flex;
  margin-bottom: 1rem;
  color: #4d78bf;
  font-size: 0.95rem;
  font-weight: 700;
}

.metric-card strong {
  display: block;
  font-size: 2.4rem;
  line-height: 1;
  margin-bottom: 0.75rem;
  color: #0f2f60;
}

.metric-card p {
  color: #5c6f8e;
  line-height: 1.7;
}

.dashboard-grid {
  display: grid;
  gap: 1.5rem;
}

.panel {
  padding: 1.8rem;
  border-radius: 28px;
  background: rgba(255, 255, 255, 0.96);
  border: 1px solid rgba(79, 129, 255, 0.14);
  box-shadow: 0 24px 60px rgba(22, 64, 140, 0.05);
}

.panel-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: 1.7rem;
}

.panel-header h2 {
  margin: 0;
  font-size: 1.3rem;
}

.panel-header p {
  margin: 0.35rem 0 0;
  color: #546a8f;
  font-size: 0.95rem;
}

.badge {
  align-self: center;
  padding: 0.55rem 0.9rem;
  border-radius: 999px;
  background: #eaf0ff;
  color: #1d4db5;
  font-size: 0.84rem;
  font-weight: 700;
}

.chart {
  display: grid;
  gap: 1rem;
  margin-top: 10.2rem;
}

.chart-axis {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  color: #7a92ba;
  font-size: 0.82rem;
}

.chart-bars {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  align-items: end;
  gap: 0.9rem;
  min-height: 260px;
}

.chart-bar {
  position: relative;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  background: linear-gradient(180deg, #3f7dff 0%, #145cdf 100%);
  border-radius: 18px;
  transition: height 0.5s ease;
}

.chart-bar span {
  display: block;
  margin-bottom: 0.65rem;
  color: white;
  font-size: 0.88rem;
  font-weight: 700;
}

.chart-bar:nth-child(odd) {
  opacity: 0.95;
}

.region-list {
  display: grid;
  gap: 1rem;
}

.region-card {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding: 1.25rem 1.4rem;
  border-radius: 22px;
  background: linear-gradient(180deg, rgba(242, 249, 255, 0.96), #ffffff);
  border: 1px solid rgba(85, 136, 253, 0.12);
}

.region-card h3 {
  margin: 0;
  font-size: 1rem;
}

.region-card p {
  margin: 0.35rem 0 0;
  color: #5b6f92;
  font-size: 0.92rem;
}

.region-card strong {
  font-size: 1.8rem;
  color: #164cbd;
}

.table-panel table {
  width: 100%;
  border-collapse: collapse;
  min-width: 100%;
}

.table-panel th,
.table-panel td {
  text-align: left;
  padding: 0.95rem 1rem;
  border-bottom: 1px solid rgba(98, 129, 212, 0.12);
}

.table-panel th {
  color: #4c6e9e;
  font-size: 0.9rem;
  font-weight: 700;
}

.table-panel tbody tr:hover {
  background: rgba(70, 108, 241, 0.05);
}

.table-panel td {
  color: #274169;
  font-size: 0.95rem;
}

.tag-on-time,
.tag-late {
  display: inline-flex;
  align-items: center;
  padding: 0.35rem 0.75rem;
  border-radius: 999px;
  font-size: 0.85rem;
  font-weight: 700;
}

.tag-on-time {
  background: #e7f5ed;
  color: #1b6f46;
}

.tag-late {
  background: #ffe8e8;
  color: #b22020;
}

.ticket-form {
  display: grid;
  gap: 1rem;
}

.ticket-form label {
  font-size: 0.95rem;
  color: #3f5d89;
}

.ticket-form textarea {
  min-height: 130px;
  border-radius: 18px;
  border: 1px solid rgba(77, 117, 226, 0.16);
  padding: 1rem;
  resize: vertical;
  color: #102d58;
  background: rgba(246, 250, 255, 0.95);
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}

.ticket-form textarea:focus {
  outline: none;
  border-color: #3f7dff;
  box-shadow: 0 0 0 4px rgba(63, 125, 255, 0.14);
}

.ticket-form button {
  width: fit-content;
  padding: 0.95rem 1.5rem;
  border: none;
  border-radius: 14px;
  background: linear-gradient(135deg, #1969ff, #0f47d7);
  color: white;
  font-size: 0.95rem;
  font-weight: 700;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.ticket-form button:hover {
  transform: translateY(-1px);
  box-shadow: 0 16px 30px rgba(15, 71, 215, 0.2);
}

.ticket-status {
  color: #1c4a7f;
  font-size: 0.95rem;
}

@media (min-width: 900px) {
  .dashboard-grid {
    grid-template-columns: 1.65fr 1fr;
    grid-template-rows: auto auto;
    gap: 1.5rem;
  }

  .chart-panel {
    grid-column: 1 / 2;
  }

  .region-panel {
    grid-column: 2 / 3;
  }

  .table-panel {
    grid-column: 1 / 2;
  }

  .ticket-panel {
    grid-column: 2 / 3;
  }
}

@media (min-width: 1200px) {
  .hero {
    grid-template-columns: 1fr auto;
    align-items: center;
  }
}
</style>
