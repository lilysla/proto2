const dateFilter = document.getElementById('dateFilter');
const shipmentVolume = document.getElementById('shipmentVolume');
const shipmentInterval = document.getElementById('shipmentInterval');
const shipmentChart = document.getElementById('shipmentChart');
const onTimeRate = document.getElementById('onTimeRate');
const onTimeFill = document.getElementById('onTimeFill');
const onTimeDetail = document.getElementById('onTimeDetail');
const exceptionList = document.getElementById('exceptionList');
const orderTable = document.getElementById('orderTable');
const regionPerformance = document.getElementById('regionPerformance');
const ticketModal = document.getElementById('ticketModal');
const openTicketButton = document.getElementById('openTicketButton');
const closeModal = document.getElementById('closeModal');
const ticketForm = document.getElementById('ticketForm');

const ranges = [
  { label: 'Last 7 days', value: '7' },
  { label: 'Last 30 days', value: '30' },
  { label: 'This quarter', value: 'quarter' },
];

const rawData = {
  shipments: [
    { date: '2026-06-19', volume: 114 },
    { date: '2026-06-20', volume: 125 },
    { date: '2026-06-21', volume: 103 },
    { date: '2026-06-22', volume: 132 },
    { date: '2026-06-23', volume: 117 },
    { date: '2026-06-24', volume: 140 },
    { date: '2026-06-25', volume: 128 },
    { date: '2026-06-26', volume: 145 },
    { date: '2026-06-27', volume: 138 },
    { date: '2026-06-28', volume: 151 },
    { date: '2026-06-29', volume: 163 },
    { date: '2026-06-30', volume: 155 },
    { date: '2026-07-01', volume: 168 },
    { date: '2026-07-02', volume: 176 },
    { date: '2026-07-03', volume: 184 },
    { date: '2026-07-04', volume: 172 },
    { date: '2026-07-05', volume: 188 },
    { date: '2026-07-06', volume: 200 },
    { date: '2026-07-07', volume: 214 },
    { date: '2026-07-08', volume: 207 },
    { date: '2026-07-09', volume: 219 },
    { date: '2026-07-10', volume: 226 },
    { date: '2026-07-11', volume: 212 },
    { date: '2026-07-12', volume: 198 },
    { date: '2026-07-13', volume: 224 },
    { date: '2026-07-14', volume: 232 },
    { date: '2026-07-15', volume: 241 },
    { date: '2026-07-16', volume: 253 },
    { date: '2026-07-17', volume: 264 },
    { date: '2026-07-18', volume: 272 },
  ],
  orders: [
    { id: 'FF-4918', location: 'Chicago, IL', expected: '2026-07-16', delivered: '2026-07-15', status: 'Delivered' },
    { id: 'FF-5072', location: 'Atlanta, GA', expected: '2026-07-16', delivered: '2026-07-17', status: 'Late' },
    { id: 'FF-5130', location: 'Inland Empire, CA', expected: '2026-07-18', delivered: '2026-07-18', status: 'Delivered' },
    { id: 'FF-5021', location: 'Seattle, WA', expected: '2026-07-17', delivered: '2026-07-17', status: 'Delivered' },
    { id: 'FF-5393', location: 'Dallas, TX', expected: '2026-07-18', delivered: '2026-07-19', status: 'Late' },
    { id: 'FF-5485', location: 'Miami, FL', expected: '2026-07-19', delivered: '2026-07-19', status: 'Delivered' },
  ],
  exceptions: [
    { label: 'Customs delay', count: 5 },
    { label: 'Route deviation', count: 2 },
    { label: 'Damaged cargo', count: 3 },
  ],
  regions: [
    { name: 'North America', score: 94 },
    { name: 'Europe', score: 91 },
    { name: 'South America', score: 88 },
    { name: 'Asia Pacific', score: 86 },
  ],
};

function formatNumber(value) {
  return value.toLocaleString('en-US');
}

function buildShipmentChart(data) {
  const height = 200;
  const width = 500;
  const padding = 32;
  const maxValue = Math.max(...data.map(item => item.volume));
  const step = (width - padding * 2) / (data.length - 1);
  const points = data.map((item, index) => {
    const x = padding + index * step;
    const y = height - ((item.volume / maxValue) * (height - padding)) - 10;
    return `${x},${y}`;
  });

  const linePath = points.reduce((acc, point, index) => index === 0 ? `M${point}` : `${acc} L${point}`, '');

  const areaPath = `${linePath} L${padding + (data.length - 1) * step},${height - 10} L${padding},${height - 10} Z`;

  const line = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  line.setAttribute('d', linePath);
  line.setAttribute('fill', 'none');
  line.setAttribute('stroke', '#8bd0ff');
  line.setAttribute('stroke-width', '4');
  line.setAttribute('stroke-linecap', 'round');
  line.setAttribute('stroke-linejoin', 'round');
  line.setAttribute('style', 'stroke-dasharray:1000;stroke-dashoffset:1000;animation: drawLine 1.5s forwards ease-out;');

  const area = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  area.setAttribute('d', areaPath);
  area.setAttribute('fill', 'url(#chartGradient)');
  area.setAttribute('opacity', '0.68');

  const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
  const gradient = document.createElementNS('http://www.w3.org/2000/svg', 'linearGradient');
  gradient.setAttribute('id', 'chartGradient');
  gradient.setAttribute('x1', '0');
  gradient.setAttribute('y1', '0');
  gradient.setAttribute('x2', '0');
  gradient.setAttribute('y2', '1');
  const stopTop = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
  stopTop.setAttribute('offset', '0%');
  stopTop.setAttribute('stop-color', '#3d99ff');
  stopTop.setAttribute('stop-opacity', '0.65');
  const stopBottom = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
  stopBottom.setAttribute('offset', '100%');
  stopBottom.setAttribute('stop-color', '#07162d');
  stopBottom.setAttribute('stop-opacity', '0');
  gradient.appendChild(stopTop);
  gradient.appendChild(stopBottom);
  defs.appendChild(gradient);

  while (shipmentChart.firstChild) {
    shipmentChart.firstChild.remove();
  }

  shipmentChart.appendChild(defs);
  shipmentChart.appendChild(area);
  shipmentChart.appendChild(line);

  points.forEach(point => {
    const [x, y] = point.split(',').map(Number);
    const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    circle.setAttribute('cx', x);
    circle.setAttribute('cy', y);
    circle.setAttribute('r', '5');
    circle.setAttribute('fill', '#c5ecff');
    circle.setAttribute('opacity', '0.95');
    shipmentChart.appendChild(circle);
  });
}

function getRangeData(rangeKey) {
  const now = new Date('2026-07-18');
  let filtered;

  if (rangeKey === '7') {
    const cutoff = new Date(now);
    cutoff.setDate(cutoff.getDate() - 6);
    filtered = rawData.shipments.filter(entry => new Date(entry.date) >= cutoff);
    shipmentInterval.textContent = 'Last 7 days';
  } else if (rangeKey === '30') {
    const cutoff = new Date(now);
    cutoff.setDate(cutoff.getDate() - 29);
    filtered = rawData.shipments.filter(entry => new Date(entry.date) >= cutoff);
    shipmentInterval.textContent = 'Last 30 days';
  } else {
    filtered = rawData.shipments.filter(entry => new Date(entry.date) >= new Date('2026-07-01'));
    shipmentInterval.textContent = 'This quarter';
  }

  return filtered;
}

function renderDashboard(selectedRange) {
  const rangeData = getRangeData(selectedRange);
  const totalVolume = rangeData.reduce((acc, item) => acc + item.volume, 0);
  const avgVolume = Math.round(totalVolume / rangeData.length);

  shipmentVolume.textContent = `${formatNumber(totalVolume)} shipments`;

  buildShipmentChart(rangeData.slice(-10));

  const deliveredOnTime = rawData.orders.filter(order => order.delivered <= order.expected).length;
  const rate = Math.round((deliveredOnTime / rawData.orders.length) * 100);
  onTimeRate.textContent = `${rate}%`;
  onTimeFill.style.width = `${rate}%`;
  onTimeDetail.textContent = `${deliveredOnTime} of ${rawData.orders.length} orders delivered on schedule`;

  exceptionList.innerHTML = '';
  rawData.exceptions.forEach(exception => {
    const item = document.createElement('div');
    item.className = 'exception-pill';
    item.innerHTML = `<span>${exception.label}</span><strong>${exception.count}</strong>`;
    exceptionList.appendChild(item);
  });

  orderTable.innerHTML = rawData.orders.map(order => {
    return `<tr>
      <td>${order.id}</td>
      <td>${order.location}</td>
      <td>${order.expected}</td>
      <td>${order.delivered}</td>
      <td>${order.status}</td>
    </tr>`;
  }).join('');

  regionPerformance.innerHTML = rawData.regions.map(region => {
    return `<div class="region-item">
      <p>${region.name}</p>
      <div class="region-score">${region.score}%</div>
    </div>`;
  }).join('');
}

function populateFilters() {
  dateFilter.innerHTML = ranges.map(range => `<option value="${range.value}">${range.label}</option>`).join('');
}

function openModal() {
  ticketModal.classList.remove('hidden');
}

function closeModalAction() {
  ticketModal.classList.add('hidden');
}

function handleFormSubmit(event) {
  event.preventDefault();
  const issue = document.getElementById('ticketIssue').value;
  const message = document.getElementById('ticketMessage').value.trim();

  if (!issue || !message) {
    return;
  }

  ticketForm.reset();
  closeModalAction();
  alert('Ticket submitted: ' + issue + '\nWe will review the request and follow up.');
}

populateFilters();
dateFilter.addEventListener('change', () => {
  renderDashboard(dateFilter.value);
});
openTicketButton.addEventListener('click', openModal);
closeModal.addEventListener('click', closeModalAction);
ticketModal.addEventListener('click', event => {
  if (event.target === ticketModal) {
    closeModalAction();
  }
});
ticketForm.addEventListener('submit', handleFormSubmit);

renderDashboard('7');
