import ContactInfoSetting from "../../../components/settings/ContactInfoSetting.js";
import FaviconSetting from "../../../components/settings/FaviconSetting.js";
import LogoSettings from "../../../components/settings/LogoSettings.js";
import SocialMediaLinksSetting from "../../../components/settings/SocialMediaLinksSetting.js";
import "./settings.scss";

const SettingsPage = () => {
  return (
    <div className="settings">
      <div className="Box Box1">
        <LogoSettings />
      </div>
      <div className="Box Box2">
        <FaviconSetting />
      </div>
      <div className="Box Box5">
        <ContactInfoSetting />
      </div>
      <div className="Box Box6">
        <SocialMediaLinksSetting />
      </div>
    </div>
  );
};

export default SettingsPage;
