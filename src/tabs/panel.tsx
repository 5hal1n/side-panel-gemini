import { useEffect, useState } from 'react';
import RegistrationForm from '~tabs/RegistrationForm';
import '~tabs/styles.css';
import corporateLogo from 'url:../assets/corporate.png';

// 登録済みデータを保存するStorageキー
const REGISTRATION_KEY = 'isRegistered';
const USER_DATA_KEY = 'userData';

const SidePanel = () => {
  const [isRegistered, setIsRegistered] = useState<boolean | null>(null); // nullはロード中

  useEffect(() => {
    // 拡張機能がロードされたときに登録状態をチェック
    chrome.storage.local.get([REGISTRATION_KEY], (result) => {
      setIsRegistered(!!result[REGISTRATION_KEY]);
    });
  }, []);

  const handleRegister = (data: { email: string; company: string }) => {
    // 登録データをchrome.storage.localに保存
    chrome.storage.local.set(
      {
        [REGISTRATION_KEY]: true,
        [USER_DATA_KEY]: data, // ユーザーデータも保存しておく
      },
      () => {
        setIsRegistered(true);
        alert('登録が完了しました。Gemini Side Panelをご利用いただけます。');
        // 後でここにデータを外部送信するロジックを追加できます
        console.log('User registered:', data);
      },
    );
  };

  const [status, setStatus] = useState<{ msg: string; type: 'success' | 'error' | '' }>({
    msg: '',
    type: '',
  });

  const handleScreenshot = async () => {
    try {
      const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
      if (!tabs || tabs.length === 0 || !tabs[0].id) {
        showStatus('No active tab found', 'error');
        return;
      }

      const dataUrl = await chrome.tabs.captureVisibleTab(chrome.windows.WINDOW_ID_CURRENT, {
        format: 'png',
      });

      chrome.tabs.sendMessage(tabs[0].id, {
        type: 'GEMINI_SIDE_PANEL_PASTE_IMAGE',
        dataUrl,
      });

      showStatus('Pasting screenshot...', 'success');
    } catch (err) {
      console.error(err);
      showStatus('Failed to capture', 'error');
    }
  };

  const showStatus = (msg: string, type: 'success' | 'error') => {
    setStatus({ msg, type });
    setTimeout(() => setStatus({ msg: '', type: '' }), 3000);
  };

  if (isRegistered === null) {
    return <div className="container">ロード中...</div>; // ロード中は何も表示しないか、ローディングスピナー
  }

  if (!isRegistered) {
    return <RegistrationForm onRegister={handleRegister} />;
  }

  return (
    <div className="container">
      <div className="toolbar">
        <button
          type="button"
          className="screenshot-btn"
          onClick={handleScreenshot}
          title="Take screenshot of current tab and paste to Gemini"
        >
          <svg className="icon" viewBox="0 0 24 24">
            <title>Capture & Paste Icon</title>
            <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z" />
          </svg>
          Capture & Paste
        </button>
        <span className={`status ${status.type}`}>{status.msg}</span>
      </div>

      <iframe
        src="https://gemini.google.com"
        allow="microphone; clipboard-read; clipboard-write"
        className="main-frame"
        title="Gemini"
      />

      <div className="ad-container">
        <a href="https://banso-corp.com" target="_blank" className="ad-link" rel="noreferrer">
          <div className="ad-content">
            <img src={corporateLogo} alt="Corporate Logo" className="corporate-logo" />
          </div>
        </a>
      </div>
    </div>
  );
};

export default SidePanel;
