import LoginForm from "@/components/LoginForm";

export default function LoginPage() {
  return (
    <main
      style={{
        minHeight: "100vh",
        display: "grid",
        placeItems: "center",
        padding: 16,
        width: "100%"
      }}
    >
      <LoginForm />
    </main>
  );
}
