import Dashboard from "@/components/dashboard"
import M118AppleUI from "@/components/m118-apple-ui"
import M118NavigationEnhancer from "@/components/m118-navigation-enhancer"
import M118ContentParity from "@/components/m118-content-parity"
import M118SettingsParity from "@/components/m118-settings-parity"
import M118SohParity from "@/components/m118-soh-parity"

export default function Home() {
  return <>
    <Dashboard />
    <M118AppleUI />
    <M118NavigationEnhancer />
    <M118ContentParity />
    <M118SettingsParity />
    <M118SohParity />
  </>
}
