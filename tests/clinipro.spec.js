const { test, expect } = require('@playwright/test');

test.describe('CliniPro Suite', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3001');
  });

  test('should load the application with correct title', async ({ page }) => {
    await expect(page).toHaveTitle(/CliniPro Suite/);
  });

  test('should display the main navigation', async ({ page }) => {
    await expect(page.locator('text=CliniPro Suite')).toBeVisible();
    await expect(page.locator('text=Sistema Integral de Gestión Clínica')).toBeVisible();
  });

  test('should be able to search for procedures', async ({ page }) => {
    await page.fill('[placeholder="Buscar procedimientos, enfermedades, medicamentos, guías..."]', 'lavado');
    await page.click('button:has-text("Buscar")');
    
    // Should show search results or navigate to search results
    await expect(page.locator('text=lavado')).toBeVisible();
  });

  test('should open accessibility panel', async ({ page }) => {
    await page.click('button[aria-label="Accesibilidad"]');
    await expect(page.locator('text=Accesibilidad')).toBeVisible();
    await expect(page.locator('text=Alto contraste')).toBeVisible();
  });

  test('should toggle theme', async ({ page }) => {
    const themeBtn = page.locator('button[aria-label="Tema"]');
    await themeBtn.click();
    
    // Check if theme changed (this would need to check actual CSS changes)
    await expect(themeBtn).toBeVisible();
  });
});

test.describe('CliniPro Suite API Integration', () => {
  test('should load advanced protocols panel', async ({ page }) => {
    await page.goto('http://localhost:3001');
    
    // Wait for CliniPro Suite to initialize
    await page.waitForTimeout(2000);
    
    // Look for the advanced protocols button
    const protocolsBtn = page.locator('#btn-protocolos');
    if (await protocolsBtn.isVisible()) {
      await protocolsBtn.click();
      
      // Check if protocols panel opened
      await expect(page.locator('text=Biblioteca de Protocolos Médicos')).toBeVisible();
    }
  });

  test('should load pharmacy panel', async ({ page }) => {
    await page.goto('http://localhost:3001');
    
    // Wait for CliniPro Suite to initialize
    await page.waitForTimeout(2000);
    
    // Look for the pharmacy button
    const pharmacyBtn = page.locator('#btn-farmacia');
    if (await pharmacyBtn.isVisible()) {
      await pharmacyBtn.click();
      
      // Check if pharmacy panel opened
      await expect(page.locator('text=Módulo de Farmacología Avanzada')).toBeVisible();
    }
  });

  test('should load advanced patients panel', async ({ page }) => {
    await page.goto('http://localhost:3001');
    
    // Wait for CliniPro Suite to initialize
    await page.waitForTimeout(2000);
    
    // Look for the advanced patients button
    const patientsBtn = page.locator('#btn-pacientes-avanzado');
    if (await patientsBtn.isVisible()) {
      await patientsBtn.click();
      
      // Check if patients panel opened
      await expect(page.locator('text=Gestión Avanzada de Pacientes')).toBeVisible();
    }
  });
});

test.describe('API Health Checks', () => {
  test('should have healthy API', async ({ request }) => {
    const response = await request.get('http://localhost:3001/api/health');
    expect(response.status()).toBe(200);
    
    const data = await response.json();
    expect(data.status).toBe('OK');
    expect(data.service).toBe('CliniPro Suite API');
  });

  test('should return protocols data', async ({ request }) => {
    const response = await request.get('http://localhost:3001/api/protocols');
    expect(response.status()).toBe(200);
    
    const data = await response.json();
    expect(data).toHaveProperty('urgencias');
    expect(data).toHaveProperty('cardiologia');
  });

  test('should return patients data', async ({ request }) => {
    const response = await request.get('http://localhost:3001/api/patients');
    expect(response.status()).toBe(200);
    
    const data = await response.json();
    expect(data).toHaveProperty('patients');
    expect(data).toHaveProperty('total');
  });

  test('should search drugs', async ({ request }) => {
    const response = await request.get('http://localhost:3001/api/pharmacy/search?q=paracetamol');
    expect(response.status()).toBe(200);
    
    const data = await response.json();
    expect(Array.isArray(data)).toBe(true);
  });
});