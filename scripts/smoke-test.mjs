import { spawn } from "node:child_process";

const port = 3000;
const baseUrl = `http://localhost:${port}`;
const nextBin = "node_modules/next/dist/bin/next";

const child = spawn(process.execPath, [nextBin, "start", "-p", String(port)], {
  cwd: process.cwd(),
  env: {
    ...process.env,
    PATH: `${process.execPath.replace(/\\node\.exe$/i, "")};${process.env.PATH || ""}`
  },
  stdio: ["ignore", "pipe", "pipe"]
});

let logs = "";
child.stdout.on("data", (chunk) => {
  logs += chunk.toString();
});
child.stderr.on("data", (chunk) => {
  logs += chunk.toString();
});

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function waitForServer() {
  for (let index = 0; index < 60; index += 1) {
    try {
      const response = await fetch(baseUrl);
      if (response.ok) return;
    } catch {
      await sleep(1000);
    }
  }
  throw new Error(`Server did not become ready.\n${logs}`);
}

async function expectOk(path, init) {
  const response = await fetch(`${baseUrl}${path}`, init);
  if (!response.ok) {
    const text = await response.text();
    throw new Error(`${path} returned ${response.status}: ${text.slice(0, 240)}`);
  }
  return response;
}

try {
  await waitForServer();
  const smokeCustomerName = `Smoke Test Client ${Date.now()}`;

  for (const path of ["/", "/about", "/products", "/booking", "/contact", "/thank-you", "/admin"]) {
    await expectOk(path);
  }

  await expectOk("/api/bookings", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      fullName: smokeCustomerName,
      phone: "+201000000000",
      whatsapp: "+201000000000",
      email: "client@example.com",
      address: "Giza",
      selectedService: "Royal Bridal Makeup",
      preferredDate: "2026-09-12",
      preferredTime: "18:30",
      notes: "Automated booking smoke test"
    })
  });

  const login = await expectOk("/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: process.env.ADMIN_EMAIL || "admin@kholoudmakeup.com",
      password: process.env.ADMIN_PASSWORD || "admin12345"
    })
  });
  const cookie = login.headers.get("set-cookie");
  if (!cookie) throw new Error("Login did not set an admin session cookie.");

  const dashboard = await expectOk("/api/admin/dashboard", {
    headers: { Cookie: cookie }
  });
  const dashboardJson = await dashboard.json();
  if (!dashboardJson.analytics?.bookings) {
    throw new Error("Dashboard analytics did not include the test booking.");
  }
  const smokeCustomer = dashboardJson.customers?.find((customer) => customer.fullName === smokeCustomerName);
  if (!smokeCustomer) {
    throw new Error("Dashboard customers did not include the smoke test customer.");
  }

  for (const path of ["/admin", "/admin/products", "/admin/booking", "/admin/customers", "/admin/messages", "/admin/settings"]) {
    await expectOk(path, { headers: { Cookie: cookie } });
  }

  await expectOk(`/api/admin/customers/${smokeCustomer.id}`, {
    method: "DELETE",
    headers: { Cookie: cookie }
  });

  const dashboardAfterDelete = await expectOk("/api/admin/dashboard", {
    headers: { Cookie: cookie }
  });
  const dashboardAfterDeleteJson = await dashboardAfterDelete.json();
  if (dashboardAfterDeleteJson.customers?.some((customer) => customer.id === smokeCustomer.id)) {
    throw new Error("Customer delete endpoint did not remove the smoke test customer.");
  }

  console.log("Smoke test passed: pages, booking API, admin login, and dashboard data are working.");
} finally {
  child.kill();
}
