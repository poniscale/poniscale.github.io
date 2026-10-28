
        let captchaAnswer = 0;

        // 生成隨機加法題目
        function generateCaptcha() {
            const num1 = Math.floor(Math.random() * 10) + 1;
            const num2 = Math.floor(Math.random() * 10) + 1;
            captchaAnswer = num1 + num2;
            document.getElementById('captchaQuestion').innerText = `${num1} + ${num2}`;
            document.getElementById('captchaInput').value = '';
            document.getElementById('captchaHint').innerText = '';


        }

        // 監聽表單提交
        document.addEventListener('DOMContentLoaded', function() {
            generateCaptcha();

            document.getElementById('refreshCaptcha').addEventListener('click', generateCaptcha);

            document.getElementById('contactForm').addEventListener('submit', async function(e) {
                e.preventDefault();

                const email = document.getElementById('senderEmail').value.trim();
                const captchaVal = parseInt(document.getElementById('captchaInput').value.trim(), 10);
                const formMsg = document.getElementById('formMessage');
                const captchaHint = document.getElementById('captchaHint');

                formMsg.innerText = '';
                captchaHint.innerText = '';

                if (!document.getElementById('senderEmail').checkValidity()) {
                    formMsg.innerText = '請輸入有效的 Email 地址。';
                    formMsg.className = 'form-message error';
                    return;
                }

                if (isNaN(captchaVal)) {
                    captchaHint.innerText = '請輸入驗證碼數字。';
                    return;
                }

                if (captchaVal !== captchaAnswer) {
                    generateCaptcha();
                    captchaHint.innerText = '驗證碼錯誤，請再試一次。';
                    return;
                }

                const name = document.getElementById('senderName').value.trim() || '未提供';
                const message = document.getElementById('message').value.trim() || '無';

                const submitBtn = document.getElementById('submitBtn');
                submitBtn.disabled = true;
                submitBtn.innerText = '傳送中...';

                const scriptURL = 'https://script.google.com/macros/s/AKfycbxBNKydc11ir8x1U_Wg7t28mp2LFFHdD0g8bvpsw3axiUKK2ZlNbtciH4Cr-VtfFLXH5A/exec';

                try {
                    const formData = new URLSearchParams();
                    formData.append("name", name);
                    formData.append("email", email);
                    formData.append("message", message);

                    const response = await fetch(scriptURL, {
                        method: "POST",
                        body: formData
                    });

                    const result = await response.json();

                    if (result.success) {
                        formMsg.innerText = '✅ 訊息已成功送出，我們會盡快回覆您！';
                        formMsg.className = 'form-message success';
                        document.getElementById('contactForm').reset();
                        generateCaptcha();
                    } else {
                        throw new Error(result.error || '傳送失敗');
                    }
                } catch (error) {
                    formMsg.innerText = '❌ 傳送失敗，請稍後再試或直接來電。';
                    formMsg.className = 'form-message error';
                    console.error('傳送錯誤:', error);
                } finally {
                    submitBtn.disabled = false;
                    submitBtn.innerText = '✉️ 送出訊息';
                }
            });
        });
    