import { useState } from "react";
import { Switch, FormControl, FormLabel, Input, Stack } from "@chakra-ui/react";
import { Button } from "../../widgets/button";

const SettingsPage = () => {
  const [profile, setProfile] = useState({
    username: "admin",
    email: "admin@email.com",
  });
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState(true);

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    // TODO: Save settings to backend
    alert("Settings saved!");
  };

  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold mb-6">Settings</h2>
      <div className="bg-white rounded-xl shadow p-6 max-w-xl">
        <form
          onSubmit={e => {
            e.preventDefault();
            handleSave();
          }}
        >
          <Stack spacing={6}>
            <div>
              <h3 className="font-semibold text-lg mb-2">Profile</h3>
              <FormControl mb={3}>
                <FormLabel>Username</FormLabel>
                <Input
                  name="username"
                  value={profile.username}
                  onChange={handleProfileChange}
                  placeholder="Username"
                />
              </FormControl>
              <FormControl>
                <FormLabel>Email</FormLabel>
                <Input
                  name="email"
                  type="email"
                  value={profile.email}
                  onChange={handleProfileChange}
                  placeholder="Email"
                />
              </FormControl>
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-2">Preferences</h3>
              <FormControl display="flex" alignItems="center" mb={3}>
                <FormLabel htmlFor="dark-mode" mb="0">
                  Dark Mode
                </FormLabel>
                <Switch
                  id="dark-mode"
                  isChecked={darkMode}
                  onChange={() => setDarkMode((v) => !v)}
                  colorScheme="blue"
                />
              </FormControl>
              <FormControl display="flex" alignItems="center">
                <FormLabel htmlFor="notifications" mb="0">
                  Email Notifications
                </FormLabel>
                <Switch
                  id="notifications"
                  isChecked={notifications}
                  onChange={() => setNotifications((v) => !v)}
                  colorScheme="blue"
                />
              </FormControl>
            </div>
            <Button className="bg-blue-500 text-white rounded-lg font-bold" type="submit">
              Save Changes
            </Button>
          </Stack>
        </form>
      </div>
    </div>
  );
};

export default SettingsPage;