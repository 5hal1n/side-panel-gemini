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
      showStatus('Pasting screenshot...', 'success');
    } catch (e) {
      console.error(e);
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
          <svg
            xmlns="http://www.w3.org/2000/svg"
            height="24px"
            viewBox="0 -960 960 960"
            width="24px"
            fill="#5985E1"
          >
            <title>Screenshot Frame</title>
            <path d="M200-680v-120q0-33 23.5-56.5T280-880h120v80H280v120h-80Zm80 600q-33 0-56.5-23.5T200-160v-120h80v120h120v80H280Zm400-600v-120H560v-80h120q33 0 56.5 23.5T760-800v120h-80ZM560-80v-80h120v-120h80v120q0 33-23.5 56.5T680-80H560Z" />
          </svg>
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
