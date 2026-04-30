const form = document.querySelector<HTMLFormElement>('#js-contact-form');
const submitBtn = document.querySelector<HTMLButtonElement>('#js-submit');

if (form && submitBtn) {
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    submitBtn.disabled = true;
    submitBtn.textContent = '送信中...';

    const formData = new FormData(form);
    const accessKey = import.meta.env.VITE_WEB3FORMS_KEY;

    formData.set('access_key', accessKey);

    try {
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();
      console.log('送信結果:', result);

      if (result.success) {
        window.location.href = '/thanks.html';
      } else {
        alert('送信に失敗しました。Access Key またはドメイン設定を確認してください。');
      }
    } catch (error) {
      console.error(error);
      alert('通信エラーが発生しました。');
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = '送信する';
    }
  });
}
