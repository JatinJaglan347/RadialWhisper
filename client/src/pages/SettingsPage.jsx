import React, { useState, useEffect } from "react";
import { 
  Bell, Shield, Globe, Eye, Moon, Volume2, Radio, MessageSquare, 
  ToggleLeft, ToggleRight, ChevronRight, Save, Clock, Smartphone, 
  Trash2, LogOut, AlertTriangle
} from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";
import { Link } from "react-router-dom";

const SettingPage = () => {
  const { authUser, logout } = useAuthStore();
  const userData = authUser?.data?.user;

  // Settings state
  const [settings, setSettings] = useState({
    notifications: {
      newUserNearby: true,
      messageReceived: true,
      radiusUpdates: false,
      appUpdates: true,
      marketingEmails: false,
    },
    privacy: {
      showOnlineStatus: true,
      shareActivity: false,
      allowLocationTracking: true,
      visibleToAll: true,
      anonymousMode: false,
    },
    appearance: {
      darkMode: true,
      fontSize: "medium",
      language: "en",
    },
    chat: {
      autoDeleteMessages: false,
      autoDeleteDuration: "24h",
      readReceipts: true,
      typingIndicators: true,
    },
    radius: {
      defaultRadius: userData?.locationRadiusPreference || 100,
      showExactDistance: true,
      autoExpandInQuietAreas: false,
    },
    account: {
      emailVerified: true,
      phoneVerified: false,
    }
  });

  // Save settings to backend
  const saveSettings = () => {
    console.log("Saving settings:", settings);
    // API call to save settings would go here
    // Example: api.updateUserSettings(userData.id, settings)
    
    // Show success message
    setSaveMessage("Settings saved successfully");
    setTimeout(() => setSaveMessage(""), 3000);
  };

  const [saveMessage, setSaveMessage] = useState("");

  // Handle toggle change
  const handleToggle = (category, setting) => {
    setSettings({
      ...settings,
      [category]: {
        ...settings[category],
        [setting]: !settings[category][setting]
      }
    });
  };

  // Handle range input change
  const handleRangeChange = (value) => {
    setSettings({
      ...settings,
      radius: {
        ...settings.radius,
        defaultRadius: parseInt(value)
      }
    });
  };

  // Handle select input change
  const handleSelectChange = (category, setting, value) => {
    setSettings({
      ...settings,
      [category]: {
        ...settings[category],
        [setting]: value
      }
    });
  };

  const [activeTab, setActiveTab] = useState("notifications");

  const handleDeleteAccount = () => {
    if (window.confirm("Are you sure you want to delete your account? This action cannot be undone.")) {
      console.log("Delete account confirmed");
      // API call to delete account
    }
  };

  if (!userData) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#272829]">
        <p className="text-xl font-semibold text-[#D8D9DA]">Loading settings...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#272829] py-8 px-4">


      {/* Warning Banner */}
<div className="container mx-auto max-w-6xl mb-6">
  <div className="bg-amber-500/20 border border-amber-500/30 rounded-xl p-4 shadow-lg">
    <div className="flex items-center gap-3">
      <AlertTriangle size={24} className="text-amber-400 flex-shrink-0" />
      <div>
        <h3 className="font-medium text-amber-400">Development Notice</h3>
        <p className="text-[#D8D9DA]">This settings page is currently under development. All functionality shown is for presentation purposes only.</p>
      </div>
    </div>
  </div>
</div>
      <div className="container mx-auto max-w-6xl">
        {/* Settings Header */}
        <div className="bg-[#272829] border border-[#61677A] rounded-xl shadow-xl p-6 mb-8">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center">
              <div className="avatar mr-4">
                <div className="w-16 h-16 rounded-full ring ring-[#61677A] ring-offset-1 ring-offset-[#272829]">
                  <img
                    src={userData.profileImageURL || "https://via.placeholder.com/150"}
                    alt="Profile"
                    className="object-cover"
                  />
                </div>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-[#FFF6E0]">Account Settings</h1>
                <p className="text-[#D8D9DA]">{userData.email}</p>
              </div>
            </div>
            
            <div className="mt-4 md:mt-0">
              <Link to="/chat/profile" className="btn bg-[#61677A]/30 hover:bg-[#61677A]/50 text-[#FFF6E0] px-4 py-2 rounded-full font-medium transition-all duration-300 border border-[#FFF6E0]/20 hover:border-[#FFF6E0]/40">
                View Profile
              </Link>
            </div>
          </div>
        </div>

        {/* Settings Navigation and Content */}
        <div className="flex flex-col md:flex-row gap-8">
          {/* Navigation */}
          <div className="md:w-1/4">
            <div className="bg-[#272829] border border-[#61677A] rounded-xl shadow-xl p-4">
              <nav>
                <ul className="space-y-2">
                  <li>
                    <button 
                      onClick={() => setActiveTab("notifications")} 
                      className={`w-full text-left px-4 py-3 rounded-lg flex items-center gap-3 transition-colors ${activeTab === "notifications" ? "bg-[#61677A]/30 text-[#FFF6E0]" : "text-[#D8D9DA] hover:bg-[#61677A]/10"}`}
                    >
                      <Bell size={20} />
                      <span>Notifications</span>
                    </button>
                  </li>
                  <li>
                    <button 
                      onClick={() => setActiveTab("privacy")} 
                      className={`w-full text-left px-4 py-3 rounded-lg flex items-center gap-3 transition-colors ${activeTab === "privacy" ? "bg-[#61677A]/30 text-[#FFF6E0]" : "text-[#D8D9DA] hover:bg-[#61677A]/10"}`}
                    >
                      <Shield size={20} />
                      <span>Privacy</span>
                    </button>
                  </li>
                  <li>
                    <button 
                      onClick={() => setActiveTab("appearance")} 
                      className={`w-full text-left px-4 py-3 rounded-lg flex items-center gap-3 transition-colors ${activeTab === "appearance" ? "bg-[#61677A]/30 text-[#FFF6E0]" : "text-[#D8D9DA] hover:bg-[#61677A]/10"}`}
                    >
                      <Moon size={20} />
                      <span>Appearance</span>
                    </button>
                  </li>
                  <li>
                    <button 
                      onClick={() => setActiveTab("chat")} 
                      className={`w-full text-left px-4 py-3 rounded-lg flex items-center gap-3 transition-colors ${activeTab === "chat" ? "bg-[#61677A]/30 text-[#FFF6E0]" : "text-[#D8D9DA] hover:bg-[#61677A]/10"}`}
                    >
                      <MessageSquare size={20} />
                      <span>Chat Settings</span>
                    </button>
                  </li>
                  <li>
                    <button 
                      onClick={() => setActiveTab("radius")} 
                      className={`w-full text-left px-4 py-3 rounded-lg flex items-center gap-3 transition-colors ${activeTab === "radius" ? "bg-[#61677A]/30 text-[#FFF6E0]" : "text-[#D8D9DA] hover:bg-[#61677A]/10"}`}
                    >
                      <Radio size={20} />
                      <span>Radius Settings</span>
                    </button>
                  </li>
                  <li>
                    <button 
                      onClick={() => setActiveTab("account")} 
                      className={`w-full text-left px-4 py-3 rounded-lg flex items-center gap-3 transition-colors ${activeTab === "account" ? "bg-[#61677A]/30 text-[#FFF6E0]" : "text-[#D8D9DA] hover:bg-[#61677A]/10"}`}
                    >
                      <Smartphone size={20} />
                      <span>Account</span>
                    </button>
                  </li>
                </ul>
              </nav>
            </div>
          </div>

          {/* Settings Content */}
          <div className="md:w-3/4">
            <div className="bg-[#272829] border border-[#61677A] rounded-xl shadow-xl p-6">
              {/* Notifications Settings */}
              {activeTab === "notifications" && (
                <div>
                  <h2 className="text-2xl font-bold text-[#FFF6E0] mb-6 flex items-center gap-2">
                    <Bell size={24} className="text-[#FFF6E0]" />
                    Notification Settings
                  </h2>

                  <div className="space-y-6">
                    <div className="flex items-center justify-between py-3 border-b border-[#61677A]/30">
                      <div>
                        <h3 className="font-medium text-[#FFF6E0]">New User Nearby</h3>
                        <p className="text-sm text-[#D8D9DA]/70">Get notified when new users enter your radius</p>
                      </div>
                      <button
                        className="p-1"
                        onClick={() => handleToggle("notifications", "newUserNearby")}
                      >
                        {settings.notifications.newUserNearby ? (
                          <ToggleRight size={28} className="text-[#FFF6E0]" />
                        ) : (
                          <ToggleLeft size={28} className="text-[#D8D9DA]" />
                        )}
                      </button>
                    </div>

                    <div className="flex items-center justify-between py-3 border-b border-[#61677A]/30">
                      <div>
                        <h3 className="font-medium text-[#FFF6E0]">Message Notifications</h3>
                        <p className="text-sm text-[#D8D9DA]/70">Get notified when you receive new messages</p>
                      </div>
                      <button
                        className="p-1"
                        onClick={() => handleToggle("notifications", "messageReceived")}
                      >
                        {settings.notifications.messageReceived ? (
                          <ToggleRight size={28} className="text-[#FFF6E0]" />
                        ) : (
                          <ToggleLeft size={28} className="text-[#D8D9DA]" />
                        )}
                      </button>
                    </div>

                    <div className="flex items-center justify-between py-3 border-b border-[#61677A]/30">
                      <div>
                        <h3 className="font-medium text-[#FFF6E0]">Radius Updates</h3>
                        <p className="text-sm text-[#D8D9DA]/70">Get notified about major changes in your radius</p>
                      </div>
                      <button
                        className="p-1"
                        onClick={() => handleToggle("notifications", "radiusUpdates")}
                      >
                        {settings.notifications.radiusUpdates ? (
                          <ToggleRight size={28} className="text-[#FFF6E0]" />
                        ) : (
                          <ToggleLeft size={28} className="text-[#D8D9DA]" />
                        )}
                      </button>
                    </div>

                    <div className="flex items-center justify-between py-3 border-b border-[#61677A]/30">
                      <div>
                        <h3 className="font-medium text-[#FFF6E0]">App Updates</h3>
                        <p className="text-sm text-[#D8D9DA]/70">Get notified about new features and updates</p>
                      </div>
                      <button
                        className="p-1"
                        onClick={() => handleToggle("notifications", "appUpdates")}
                      >
                        {settings.notifications.appUpdates ? (
                          <ToggleRight size={28} className="text-[#FFF6E0]" />
                        ) : (
                          <ToggleLeft size={28} className="text-[#D8D9DA]" />
                        )}
                      </button>
                    </div>

                    <div className="flex items-center justify-between py-3 border-b border-[#61677A]/30">
                      <div>
                        <h3 className="font-medium text-[#FFF6E0]">Marketing Emails</h3>
                        <p className="text-sm text-[#D8D9DA]/70">Receive emails about promotions and offers</p>
                      </div>
                      <button
                        className="p-1"
                        onClick={() => handleToggle("notifications", "marketingEmails")}
                      >
                        {settings.notifications.marketingEmails ? (
                          <ToggleRight size={28} className="text-[#FFF6E0]" />
                        ) : (
                          <ToggleLeft size={28} className="text-[#D8D9DA]" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Privacy Settings */}
              {activeTab === "privacy" && (
                <div>
                  <h2 className="text-2xl font-bold text-[#FFF6E0] mb-6 flex items-center gap-2">
                    <Shield size={24} className="text-[#FFF6E0]" />
                    Privacy Settings
                  </h2>

                  <div className="space-y-6">
                    <div className="flex items-center justify-between py-3 border-b border-[#61677A]/30">
                      <div>
                        <h3 className="font-medium text-[#FFF6E0]">Show Online Status</h3>
                        <p className="text-sm text-[#D8D9DA]/70">Let others see when you're online</p>
                      </div>
                      <button
                        className="p-1"
                        onClick={() => handleToggle("privacy", "showOnlineStatus")}
                      >
                        {settings.privacy.showOnlineStatus ? (
                          <ToggleRight size={28} className="text-[#FFF6E0]" />
                        ) : (
                            <ToggleLeft size={28} className="text-[#D8D9DA]" />
                        )}
                      </button>
                    </div>

                    <div className="flex items-center justify-between py-3 border-b border-[#61677A]/30">
                      <div>
                        <h3 className="font-medium text-[#FFF6E0]">Share Activity</h3>
                        <p className="text-sm text-[#D8D9DA]/70">Allow others to see your recent activity</p>
                      </div>
                      <button
                        className="p-1"
                        onClick={() => handleToggle("privacy", "shareActivity")}
                      >
                        {settings.privacy.shareActivity ? (
                          <ToggleRight size={28} className="text-[#FFF6E0]" />
                        ) : (
                          <ToggleLeft size={28} className="text-[#D8D9DA]" />
                        )}
                      </button>
                    </div>

                    <div className="flex items-center justify-between py-3 border-b border-[#61677A]/30">
                      <div>
                        <h3 className="font-medium text-[#FFF6E0]">Allow Location Tracking</h3>
                        <p className="text-sm text-[#D8D9DA]/70">Enable location tracking for radius features</p>
                      </div>
                      <button
                        className="p-1"
                        onClick={() => handleToggle("privacy", "allowLocationTracking")}
                      >
                        {settings.privacy.allowLocationTracking ? (
                          <ToggleRight size={28} className="text-[#FFF6E0]" />
                        ) : (
                          <ToggleLeft size={28} className="text-[#D8D9DA]" />
                        )}
                      </button>
                    </div>

                    <div className="flex items-center justify-between py-3 border-b border-[#61677A]/30">
                      <div>
                        <h3 className="font-medium text-[#FFF6E0]">Visible To All</h3>
                        <p className="text-sm text-[#D8D9DA]/70">Allow all users to see your profile</p>
                      </div>
                      <button
                        className="p-1"
                        onClick={() => handleToggle("privacy", "visibleToAll")}
                      >
                        {settings.privacy.visibleToAll ? (
                          <ToggleRight size={28} className="text-[#FFF6E0]" />
                        ) : (
                          <ToggleLeft size={28} className="text-[#D8D9DA]" />
                        )}
                      </button>
                    </div>

                    <div className="flex items-center justify-between py-3 border-b border-[#61677A]/30">
                      <div>
                        <h3 className="font-medium text-[#FFF6E0]">Anonymous Mode</h3>
                        <p className="text-sm text-[#D8D9DA]/70">Hide your identity from other users</p>
                      </div>
                      <button
                        className="p-1"
                        onClick={() => handleToggle("privacy", "anonymousMode")}
                      >
                        {settings.privacy.anonymousMode ? (
                          <ToggleRight size={28} className="text-[#FFF6E0]" />
                        ) : (
                          <ToggleLeft size={28} className="text-[#D8D9DA]" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Appearance Settings */}
              {activeTab === "appearance" && (
                <div>
                  <h2 className="text-2xl font-bold text-[#FFF6E0] mb-6 flex items-center gap-2">
                    <Moon size={24} className="text-[#FFF6E0]" />
                    Appearance Settings
                  </h2>

                  <div className="space-y-6">
                    <div className="flex items-center justify-between py-3 border-b border-[#61677A]/30">
                      <div>
                        <h3 className="font-medium text-[#FFF6E0]">Dark Mode</h3>
                        <p className="text-sm text-[#D8D9DA]/70">Enable dark theme for the app</p>
                      </div>
                      <button
                        className="p-1"
                        onClick={() => handleToggle("appearance", "darkMode")}
                      >
                        {settings.appearance.darkMode ? (
                          <ToggleRight size={28} className="text-[#FFF6E0]" />
                        ) : (
                          <ToggleLeft size={28} className="text-[#D8D9DA]" />
                        )}
                      </button>
                    </div>

                    <div className="flex items-center justify-between py-3 border-b border-[#61677A]/30">
                      <div>
                        <h3 className="font-medium text-[#FFF6E0]">Font Size</h3>
                        <p className="text-sm text-[#D8D9DA]/70">Choose your preferred text size</p>
                      </div>
                      <select
                        className="bg-[#61677A]/30 border border-[#61677A] rounded-lg px-3 py-2 text-[#FFF6E0]"
                        value={settings.appearance.fontSize}
                        onChange={(e) => handleSelectChange("appearance", "fontSize", e.target.value)}
                      >
                        <option value="small">Small</option>
                        <option value="medium">Medium</option>
                        <option value="large">Large</option>
                      </select>
                    </div>

                    <div className="flex items-center justify-between py-3 border-b border-[#61677A]/30">
                      <div>
                        <h3 className="font-medium text-[#FFF6E0]">Language</h3>
                        <p className="text-sm text-[#D8D9DA]/70">Choose your preferred language</p>
                      </div>
                      <select
                        className="bg-[#61677A]/30 border border-[#61677A] rounded-lg px-3 py-2 text-[#FFF6E0]"
                        value={settings.appearance.language}
                        onChange={(e) => handleSelectChange("appearance", "language", e.target.value)}
                      >
                        <option value="en">English</option>
                        <option value="es">Spanish</option>
                        <option value="fr">French</option>
                        <option value="de">German</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* Chat Settings */}
              {activeTab === "chat" && (
                <div>
                  <h2 className="text-2xl font-bold text-[#FFF6E0] mb-6 flex items-center gap-2">
                    <MessageSquare size={24} className="text-[#FFF6E0]" />
                    Chat Settings
                  </h2>

                  <div className="space-y-6">
                    <div className="flex items-center justify-between py-3 border-b border-[#61677A]/30">
                      <div>
                        <h3 className="font-medium text-[#FFF6E0]">Auto-Delete Messages</h3>
                        <p className="text-sm text-[#D8D9DA]/70">Automatically delete messages after a set time</p>
                      </div>
                      <button
                        className="p-1"
                        onClick={() => handleToggle("chat", "autoDeleteMessages")}
                      >
                        {settings.chat.autoDeleteMessages ? (
                          <ToggleRight size={28} className="text-[#FFF6E0]" />
                        ) : (
                          <ToggleLeft size={28} className="text-[#D8D9DA]" />
                        )}
                      </button>
                    </div>

                    {settings.chat.autoDeleteMessages && (
                      <div className="flex items-center justify-between py-3 border-b border-[#61677A]/30">
                        <div>
                          <h3 className="font-medium text-[#FFF6E0]">Auto-Delete Duration</h3>
                          <p className="text-sm text-[#D8D9DA]/70">Set how long to keep messages before deleting</p>
                        </div>
                        <select
                          className="bg-[#61677A]/30 border border-[#61677A] rounded-lg px-3 py-2 text-[#FFF6E0]"
                          value={settings.chat.autoDeleteDuration}
                          onChange={(e) => handleSelectChange("chat", "autoDeleteDuration", e.target.value)}
                        >
                          <option value="1h">1 hour</option>
                          <option value="24h">24 hours</option>
                          <option value="7d">7 days</option>
                          <option value="30d">30 days</option>
                        </select>
                      </div>
                    )}

                    <div className="flex items-center justify-between py-3 border-b border-[#61677A]/30">
                      <div>
                        <h3 className="font-medium text-[#FFF6E0]">Read Receipts</h3>
                        <p className="text-sm text-[#D8D9DA]/70">Show when you've read messages</p>
                      </div>
                      <button
                        className="p-1"
                        onClick={() => handleToggle("chat", "readReceipts")}
                      >
                        {settings.chat.readReceipts ? (
                          <ToggleRight size={28} className="text-[#FFF6E0]" />
                        ) : (
                          <ToggleLeft size={28} className="text-[#D8D9DA]" />
                        )}
                      </button>
                    </div>

                    <div className="flex items-center justify-between py-3 border-b border-[#61677A]/30">
                      <div>
                        <h3 className="font-medium text-[#FFF6E0]">Typing Indicators</h3>
                        <p className="text-sm text-[#D8D9DA]/70">Show when you're typing a message</p>
                      </div>
                      <button
                        className="p-1"
                        onClick={() => handleToggle("chat", "typingIndicators")}
                      >
                        {settings.chat.typingIndicators ? (
                          <ToggleRight size={28} className="text-[#FFF6E0]" />
                        ) : (
                          <ToggleLeft size={28} className="text-[#D8D9DA]" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Radius Settings */}
              {activeTab === "radius" && (
                <div>
                  <h2 className="text-2xl font-bold text-[#FFF6E0] mb-6 flex items-center gap-2">
                    <Radio size={24} className="text-[#FFF6E0]" />
                    Radius Settings
                  </h2>

                  <div className="space-y-6">
                    <div className="py-3 border-b border-[#61677A]/30">
                      <div className="mb-3">
                        <h3 className="font-medium text-[#FFF6E0]">Default Radius</h3>
                        <p className="text-sm text-[#D8D9DA]/70">Set your default search radius (in meters)</p>
                      </div>
                      <div className="flex items-center gap-4">
                        <input
                          type="range"
                          min="50"
                          max="5000"
                          step="50"
                          value={settings.radius.defaultRadius}
                          onChange={(e) => handleRangeChange(e.target.value)}
                          className="w-full"
                        />
                        <span className="text-[#FFF6E0] font-medium">{settings.radius.defaultRadius}m</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between py-3 border-b border-[#61677A]/30">
                      <div>
                        <h3 className="font-medium text-[#FFF6E0]">Show Exact Distance</h3>
                        <p className="text-sm text-[#D8D9DA]/70">Show exact distance to other users</p>
                      </div>
                      <button
                        className="p-1"
                        onClick={() => handleToggle("radius", "showExactDistance")}
                      >
                        {settings.radius.showExactDistance ? (
                          <ToggleRight size={28} className="text-[#FFF6E0]" />
                        ) : (
                          <ToggleLeft size={28} className="text-[#D8D9DA]" />
                        )}
                      </button>
                    </div>

                    <div className="flex items-center justify-between py-3 border-b border-[#61677A]/30">
                      <div>
                        <h3 className="font-medium text-[#FFF6E0]">Auto-Expand in Quiet Areas</h3>
                        <p className="text-sm text-[#D8D9DA]/70">Automatically increase radius in less populated areas</p>
                      </div>
                      <button
                        className="p-1"
                        onClick={() => handleToggle("radius", "autoExpandInQuietAreas")}
                      >
                        {settings.radius.autoExpandInQuietAreas ? (
                          <ToggleRight size={28} className="text-[#FFF6E0]" />
                        ) : (
                          <ToggleLeft size={28} className="text-[#D8D9DA]" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Account Settings */}
              {activeTab === "account" && (
                <div>
                  <h2 className="text-2xl font-bold text-[#FFF6E0] mb-6 flex items-center gap-2">
                    <Smartphone size={24} className="text-[#FFF6E0]" />
                    Account Settings
                  </h2>

                  <div className="space-y-6">
                    <div className="flex items-center justify-between py-3 border-b border-[#61677A]/30">
                      <div>
                        <h3 className="font-medium text-[#FFF6E0]">Email Verification</h3>
                        <p className="text-sm text-[#D8D9DA]/70">{settings.account.emailVerified ? "Your email is verified" : "Please verify your email"}</p>
                      </div>
                      <div className="flex items-center p-1">
                        {settings.account.emailVerified ? (
                          <span className="bg-green-500/20 text-green-400 py-1 px-3 rounded-full text-sm flex items-center gap-1">
                          <Shield size={14} /> Verified
                        </span>
                      ) : (
                        <button className="bg-amber-500/20 text-amber-400 py-1 px-3 rounded-full text-sm">
                          Verify Now
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-between py-3 border-b border-[#61677A]/30">
                    <div>
                      <h3 className="font-medium text-[#FFF6E0]">Phone Verification</h3>
                      <p className="text-sm text-[#D8D9DA]/70">{settings.account.phoneVerified ? "Your phone is verified" : "Add phone for additional security"}</p>
                    </div>
                    <div className="flex items-center p-1">
                      {settings.account.phoneVerified ? (
                        <span className="bg-green-500/20 text-green-400 py-1 px-3 rounded-full text-sm flex items-center gap-1">
                          <Shield size={14} /> Verified
                        </span>
                      ) : (
                        <button className="bg-amber-500/20 text-amber-400 py-1 px-3 rounded-full text-sm">
                          Add Phone
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-between py-3 border-b border-[#61677A]/30">
                    <div>
                      <h3 className="font-medium text-[#FFF6E0]">Change Password</h3>
                      <p className="text-sm text-[#D8D9DA]/70">Update your account password</p>
                    </div>
                    <button className="bg-[#61677A]/30 hover:bg-[#61677A]/50 text-[#FFF6E0] px-3 py-1 rounded-lg font-medium text-sm transition-all duration-300 border border-[#FFF6E0]/20 hover:border-[#FFF6E0]/40">
                      Update
                    </button>
                  </div>

                  <div className="pt-8">
                    <h3 className="font-medium text-[#FFF6E0] mb-4 flex items-center gap-2">
                      <AlertTriangle className="text-red-400" size={20} />
                      Danger Zone
                    </h3>

                    <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div>
                          <h4 className="font-medium text-red-400">Delete Account</h4>
                          <p className="text-sm text-[#D8D9DA]/70">This action cannot be undone</p>
                        </div>
                        <button 
                          onClick={handleDeleteAccount}
                          className="bg-red-500/20 hover:bg-red-500/40 text-red-400 px-4 py-2 rounded-lg font-medium transition-all duration-300 border border-red-500/30 hover:border-red-500/50 flex items-center gap-2"
                        >
                          <Trash2 size={16} />
                          Delete Account
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Save Button */}
            <div className="mt-8 flex flex-col sm:flex-row justify-between items-center">
              <div>
                {saveMessage && (
                  <p className="text-green-400 flex items-center gap-1 mb-4 sm:mb-0">
                    <Shield size={16} /> {saveMessage}
                  </p>
                )}
              </div>
              <div className="flex gap-4">
                <button
                  onClick={() => logout()}
                  className="bg-[#61677A]/30 hover:bg-[#61677A]/50 text-[#D8D9DA] px-4 py-2 rounded-lg font-medium transition-all duration-300 border border-[#61677A]/30 hover:border-[#61677A]/50 flex items-center gap-2"
                >
                  <LogOut size={16} />
                  Logout
                </button>
                <button
                  onClick={saveSettings}
                  className="bg-[#61677A] hover:bg-[#61677A]/80 text-[#FFF6E0] px-4 py-2 rounded-lg font-medium transition-all duration-300 flex items-center gap-2"
                >
                  <Save size={16} />
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);
};

export default SettingPage;