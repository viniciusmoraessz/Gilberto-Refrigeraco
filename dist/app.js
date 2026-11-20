// Brazilian WhatsApp number, including country and area codes.
const companyWhatsApp = '';
const baseMessage = 'Olá, Gilberto! Vim pelo site e gostaria de solicitar um orçamento.';
const whatsappUrl = message => `https://wa.me/${companyWhatsApp}?text=${encodeURIComponent(message)}`;
if (companyWhatsApp) {
  const button = document.querySelector('[data-whatsapp]');
  const link = document.createElement('a');
  link.className = button.className;
  link.textContent = button.textContent;
  link.href = whatsappUrl(baseMessage);
  link.target = '_blank';
  link.rel = 'noopener noreferrer';
  button.replaceWith(link);
  document.querySelector('.whatsapp-status').textContent = 'Você será direcionado ao WhatsApp. Envie a mensagem quando quiser.';
  document.querySelectorAll('[data-service]').forEach(link => {
    link.href = whatsappUrl(`Olá, Gilberto! Vim pelo site e gostaria de um orçamento para ${link.dataset.service}.`);
    link.target = '_blank'; link.rel = 'noopener noreferrer';
  });
}
document.querySelector('#year').textContent = new Date().getFullYear();
