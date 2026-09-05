import { useState, useEffect, type ReactNode } from 'react';
import type { StoreWithMetrics, Product, Category, Plan, Order } from './types/store';
import { initialStores } from './data/stores';
import { initialProducts } from './data/products';
import { initialCategories } from './data/categories';
import { initialPlans } from './data/plans';
import { STORE_THEME_PRESETS } from './data/storeThemes';
import { OrdersProvider, useOrders } from './storefront/ordersContext';
import { CartProvider } from './storefront/CartContext';
import { CustomerProvider, useCustomer } from './storefront/customerContext';
import { Sidebar } from './components/Sidebar';
import { AdminSidebar } from './components/AdminSidebar';
import { StoreLayout } from './components/StoreLayout';
import { TopBar } from './components/TopBar';
import { DashboardView } from './components/DashboardView';
import { AdminDashboardView } from './components/AdminDashboardView';
import { AdminStoresView } from './components/AdminStoresView';
import { AdminUsersView } from './components/AdminUsersView';
import { AdminActivityReportsView } from './components/AdminActivityReportsView';
import { AccountPanel } from './components/AccountPanel';
import { StoreGrid } from './components/StoreGrid';
import { CreateStoreForm } from './components/CreateStoreForm';
import { ConfigStoreForm } from './components/ConfigStoreForm';
import { ThemesView } from './components/ThemesView';
import { StoreHome } from './components/StoreHome';
import { ProductsTable } from './components/ProductsTable';
import { ProductForm } from './components/ProductForm';
import { InventoryView } from './components/InventoryView';
import { CategoriesManager } from './components/CategoriesManager';
import { OrdersList } from './components/OrdersList';
import { PlansView } from './components/PlansView';
import { PlansAdminView } from './components/PlansAdminView';
import { Storefront } from './storefront/Storefront';
import { AuthLayout } from './components/AuthLayout';
import { AuthProvider, useAuth } from './auth/AuthContext';
import { Routes, Route, Navigate } from 'react-router-dom';
import { LandingPage } from './components/LandingPage';
import { DemoNavbars } from './components/DemoNavbars';

type View = 'dashboard' | 'stores' | 'create' | 'config' | 'plans' | 'admin-stores' | 'admin-users' | 'admin-activity' | 'admin-reports';
type StoreView = 'home' | 'orders' | 'products' | 'inventory' | 'categories' | 'product-form' | 'plan' | 'config' | 'themes';

function loadLocalData<T>(key: string, fallback: T): T {
  try {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) as T : fallback;
  } catch {
    return fallback;
  }
}

const VIEW_TITLES: Record<View, string> = {
  dashboard: 'Dashboard',
  stores: 'Mis Tiendas',
  create: 'Crear Tienda',
  config: 'Configurar Tienda',
  plans: 'Planes',
  'admin-stores': 'Tiendas',
  'admin-users': 'Usuarios',
  'admin-activity': 'Actividad',
  'admin-reports': 'Reportes',
};

function RequireRole({ role, children }: { role: 'PROPIETARIO' | 'ADMINISTRADOR'; children: ReactNode }) {
  const { currentUser } = useAuth();
  if (!currentUser) return <Navigate to="/login" replace />;
  if (currentUser.role !== role) {
    return <Navigate to={currentUser.role === 'ADMINISTRADOR' ? '/admin' : '/app/tiendas'} replace />;
  }
  return <>{children}</>;
}

export default function App() {
  return (
    <AuthProvider>
      <CustomerProvider>
        <OrdersProvider>
          <CartProvider>
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/demo/navbars" element={<DemoNavbars />} />
              <Route path="/login" element={<AuthLayout mode="login" />} />
              <Route path="/register" element={<AuthLayout mode="register" />} />
              <Route path="/app" element={<Navigate to="/app/tiendas" replace />} />
              <Route
                path="/app/*"
                element={
                  <RequireRole role="PROPIETARIO">
                    <AppShell />
                  </RequireRole>
                }
              />
              <Route
                path="/admin/*"
                element={
                  <RequireRole role="ADMINISTRADOR">
                    <AppShell />
                  </RequireRole>
                }
              />
              <Route path="/tienda/:slug" element={<Storefront />} />
              <Route path="/tienda/:slug/pedidos" element={<Storefront />} />
              <Route path="/tienda/:slug/producto/:id" element={<Storefront />} />
              <Route path="/carrito" element={<Storefront />} />
              <Route path="/checkout" element={<Storefront />} />
              <Route path="/pedido/:id" element={<Storefront />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </CartProvider>
        </OrdersProvider>
      </CustomerProvider>
    </AuthProvider>
  );
}

function AppShell() {
  const { currentUser, users, logout, updateProfile } = useAuth();
  const { customers } = useCustomer();
  const [stores, setStores] = useState<StoreWithMetrics[]>(() => loadLocalData('mercatus.stores', initialStores));
  const [products, setProducts] = useState(() => loadLocalData('mercatus.products', initialProducts));
  const [categories, setCategories] = useState(() => loadLocalData('mercatus.categories', initialCategories));
  const { orders, orderItems, updateOrder } = useOrders();
  const [plans, setPlans] = useState<Plan[]>(() => loadLocalData('mercatus.plans', initialPlans));
  const [activeView, setActiveView] = useState<View>(
    currentUser?.role === 'ADMINISTRADOR' ? 'dashboard' : 'stores',
  );
  const [configStoreId, setConfigStoreId] = useState<string | null>(null);
  const [activeStoreId, setActiveStoreId] = useState<string | null>(null);
  const [storeView, setStoreView] = useState<StoreView>('home');
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [suspendedUserIds, setSuspendedUserIds] = useState<string[]>(() => loadLocalData('mercatus.suspended-users', []));
  const [accountOpen, setAccountOpen] = useState(false);

  const configStore = stores.find((s) => s.id === configStoreId) ?? null;
  const activeStore = stores.find((s) => s.id === activeStoreId) ?? null;

  useEffect(() => {
    if (currentUser) {
      setActiveView(currentUser.role === 'ADMINISTRADOR' ? 'dashboard' : 'stores');
    }
  }, [currentUser?.id]);

  useEffect(() => { localStorage.setItem('mercatus.stores', JSON.stringify(stores)); }, [stores]);
  useEffect(() => { localStorage.setItem('mercatus.products', JSON.stringify(products)); }, [products]);
  useEffect(() => { localStorage.setItem('mercatus.categories', JSON.stringify(categories)); }, [categories]);
  useEffect(() => { localStorage.setItem('mercatus.plans', JSON.stringify(plans)); }, [plans]);
  useEffect(() => { localStorage.setItem('mercatus.suspended-users', JSON.stringify(suspendedUserIds)); }, [suspendedUserIds]);

  if (!currentUser) return null;

  const isAdmin = currentUser.role === 'ADMINISTRADOR';
  const visibleStores = isAdmin ? stores : stores.filter((s) => s.ownerId === currentUser.id);

  function handleNavigate(view: string) {
    setActiveView(view as View);
    if (view !== 'config') setConfigStoreId(null);
    setSidebarOpen(false);
  }

  function handleConfigure(storeId: string) {
    setConfigStoreId(storeId);
    setActiveView('config');
    setSidebarOpen(false);
  }

  function handleEnterStore(storeId: string) {
    setActiveStoreId(storeId);
    setStoreView('home');
    setSidebarOpen(false);
  }

  function handleSwitchStore(storeId: string) {
    setActiveStoreId(storeId);
    setStoreView('home');
  }

  function handleConfigureActiveStore() {
    if (!activeStore) return;
    setStoreView('config');
    setSidebarOpen(false);
  }

  function handleExitStore() {
    setActiveStoreId(null);
    setActiveView('stores');
  }

  function handleStoreCreated(newStore: StoreWithMetrics) {
    setStores((prev) => [...prev, newStore]);
    setActiveView('stores');
  }

  function handleStoreSaved(updated: StoreWithMetrics) {
    setStores((prev) => prev.map((s) => (s.id === updated.id ? updated : s)));
    setActiveView('stores');
    setConfigStoreId(null);
  }

  function handleActiveStoreSaved(updated: StoreWithMetrics) {
    setStores((prev) => prev.map((s) => (s.id === updated.id ? updated : s)));
    setStoreView('home');
  }

  function handlePublishTheme(presetId: string, sections: NonNullable<StoreWithMetrics['theme']>['sections']) {
    if (!activeStore) return;
    const preset = STORE_THEME_PRESETS.find((item) => item.id === presetId);
    if (!preset) return;
    setStores((prev) => prev.map((store) => store.id === activeStore.id
      ? { ...store, theme: { ...store.theme, presetId, templateId: preset.theme.templateId ?? 'standard', primary: preset.theme.primary, accent: preset.theme.accent, sections } }
      : store));
  }

  function handleAddProduct() {
    setEditingProductId(null);
    setStoreView('product-form');
  }

  function handleEditProduct(id: string) {
    setEditingProductId(id);
    setStoreView('product-form');
  }

  function handleSaveProduct(product: Product) {
    if (activeStore) {
      const plan = plans.find((p) => p.id === activeStore.planId);
      const count = products.filter((p) => p.store_id === activeStore.id).length;
      if (plan && count >= plan.productLimit && !products.some((p) => p.id === product.id)) {
        return;
      }
    }
    setProducts((prev) => {
      const exists = prev.some((p) => p.id === product.id);
      return exists ? prev.map((p) => (p.id === product.id ? product : p)) : [...prev, product];
    });
    setStoreView('products');
  }

  function handleChangePlan(planId: string) {
    if (!activeStore) return;
    setStores((prev) => prev.map((s) => (s.id === activeStore.id ? { ...s, planId } : s)));
  }

  function handleSavePlan(plan: Plan) {
    setPlans((prev) => prev.map((p) => (p.id === plan.id ? plan : p)));
  }

  function handleToggleStore(storeId: string) {
    setStores((prev) => prev.map((store) => (
      store.id === storeId ? { ...store, active: !store.active } : store
    )));
  }

  function handleToggleUser(userId: string) {
    setSuspendedUserIds((prev) => prev.includes(userId) ? prev.filter((id) => id !== userId) : [...prev, userId]);
  }

  function handleDeactivateProduct(id: string) {
    setProducts((prev) => prev.map((p) => (p.id === id ? { ...p, active: false } : p)));
  }

  function handleAdjustStock(productId: string, newStock: number) {
    setProducts((prev) => prev.map((p) => (p.id === productId ? { ...p, stock: newStock } : p)));
  }

  function handleUpdateOrder(order: Order) {
    updateOrder(order);
  }

  function handleAddCategory(name: string) {
    if (!activeStore) return;
    const newCategory: Category = {
      id: `cat-${activeStore.id.slice(0, 4)}-${crypto.randomUUID().slice(0, 8)}`,
      store_id: activeStore.id,
      name,
      active: true,
    };
    setCategories((prev) => [...prev, newCategory]);
  }

  function handleToggleCategory(categoryId: string) {
    setCategories((prev) => prev.map((c) => (c.id === categoryId ? { ...c, active: !c.active } : c)));
  }

  const currentTitle = activeView === 'config' && configStore
    ? `Configurar: ${configStore.name}`
    : VIEW_TITLES[activeView];

  const inStore = activeStore !== null;
  const storeProducts = inStore ? products.filter((p) => p.store_id === activeStore.id) : [];
  const storeCategories = inStore ? categories.filter((c) => c.store_id === activeStore.id) : [];
  const activePlan = activeStore ? plans.find((p) => p.id === activeStore.planId) ?? plans[0] : null;
  const editingProduct = editingProductId
    ? products.find((p) => p.id === editingProductId) ?? null
    : null;

  return (
    <div className="flex min-h-screen">
      {inStore ? (
        <StoreLayout
          store={activeStore}
          activeView={storeView}
          onNavigate={(v) => setStoreView(v as StoreView)}
          onExit={handleExitStore}
          stores={visibleStores}
          onSwitchStore={handleSwitchStore}
          onConfigure={handleConfigureActiveStore}
        />
      ) : isAdmin ? (
        <AdminSidebar
          activeView={activeView}
          onNavigate={handleNavigate}
          userName={currentUser.name}
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />
      ) : (
        <Sidebar
          activeView={activeView}
          onNavigate={handleNavigate}
          userName={currentUser.name}
          role={currentUser.role}
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />
      )}
      <div className="ml-[260px] flex min-h-screen flex-1 flex-col max-[768px]:ml-0">
        <TopBar
          title={inStore ? (storeView === 'config' ? 'Configuración' : activeStore.name) : currentTitle}
          userName={currentUser.name}
          onLogout={logout}
          onCreateStore={isAdmin ? undefined : () => {
              handleExitStore();
              handleNavigate('create');
            }}
          onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
          onOpenAccount={() => setAccountOpen(true)}
        />
        {accountOpen && <AccountPanel user={currentUser} onSaveProfile={(name, email) => updateProfile({ name, email })} onLogout={logout} onClose={() => setAccountOpen(false)} />}
        <main className="flex-1 overflow-y-auto bg-[#fbfbf5] p-6 max-[768px]:p-4">
          {inStore ? (
            storeView === 'home' ? (
              <StoreHome
                store={activeStore}
                products={storeProducts}
                orders={orders.filter((o) => o.store_id === activeStore.id)}
                plans={plans}
              />
            ) : storeView === 'products' ? (
              <ProductsTable
                products={storeProducts}
                categories={storeCategories}
                productLimit={activePlan?.productLimit}
                planName={activePlan?.name}
                onAdd={handleAddProduct}
                onEdit={handleEditProduct}
                onDeactivate={handleDeactivateProduct}
              />
            ) : storeView === 'product-form' ? (
              <ProductForm
                storeId={activeStore.id}
                product={editingProduct}
                categories={storeCategories}
                onSave={handleSaveProduct}
                onCancel={() => setStoreView('products')}
              />
            ) : storeView === 'inventory' ? (
              <InventoryView
                products={storeProducts}
                categories={storeCategories}
                onAdjustStock={handleAdjustStock}
              />
            ) : storeView === 'categories' ? (
              <CategoriesManager
                categories={storeCategories}
                onAdd={handleAddCategory}
                onToggle={handleToggleCategory}
              />
            ) : storeView === 'plan' ? (
              <PlansView
                store={activeStore}
                productsCount={storeProducts.length}
                plans={plans}
                onUpgrade={handleChangePlan}
              />
            ) : storeView === 'orders' ? (
              <OrdersList
                orders={orders.filter((o) => o.store_id === activeStore.id)}
                orderItems={orderItems.filter((i) => orders.some((o) => o.store_id === activeStore.id && o.id === i.order_id))}
                onUpdateOrder={handleUpdateOrder}
              />
            ) : storeView === 'config' ? (
              <ConfigStoreForm
                store={activeStore}
                plans={plans}
                onSaved={handleActiveStoreSaved}
                onCancel={() => setStoreView('home')}
              />
            ) : storeView === 'themes' ? (
              <ThemesView store={activeStore} onPublish={handlePublishTheme} />
            ) : (
              <div className="flex min-h-[300px] items-center justify-center rounded-md border border-dashed border-border bg-card text-sm text-[var(--text-muted)]">Próximamente</div>
            )
          ) : (
            <>
              {activeView === 'dashboard' && (
                isAdmin
                  ? <AdminDashboardView stores={stores} plans={plans} onNavigate={handleNavigate} />
                  : <DashboardView stores={visibleStores} onSelectStore={handleEnterStore} />
              )}
              {activeView === 'stores' && (
                <StoreGrid
                  stores={visibleStores}
                  onConfigure={handleConfigure}
                  onEnter={handleEnterStore}
                  onCreate={() => handleNavigate('create')}
                />
              )}
              {activeView === 'admin-stores' && (
                <AdminStoresView stores={stores} plans={plans} onToggleStore={handleToggleStore} />
              )}
              {activeView === 'admin-users' && (
                <AdminUsersView users={users} customers={customers} stores={stores} suspendedUserIds={suspendedUserIds} onToggleUser={handleToggleUser} />
              )}
              {activeView === 'admin-activity' && (
                <AdminActivityReportsView mode="activity" stores={stores} plans={plans} />
              )}
              {activeView === 'admin-reports' && (
                <AdminActivityReportsView mode="reports" stores={stores} plans={plans} />
              )}
              {activeView === 'create' && (
                <CreateStoreForm
                  ownerId={currentUser.id}
                  ownerName={currentUser.name}
                  existingSlugs={stores.map((s) => s.slug)}
                  onStoreCreated={handleStoreCreated}
                  onCancel={() => handleNavigate('stores')}
                />
              )}
              {activeView === 'config' && configStore && (
                <ConfigStoreForm
                  store={configStore}
                  plans={plans}
                  onSaved={handleStoreSaved}
                  onCancel={() => handleNavigate('stores')}
                />
              )}
              {activeView === 'plans' && (
                <PlansAdminView plans={plans} storePlanIds={stores.map((store) => store.planId)} onSavePlan={handleSavePlan} />
              )}
              {['admin-stores', 'admin-users', 'admin-activity', 'admin-reports'].includes(activeView) && (
                <div className="flex min-h-[360px] items-center justify-center rounded-xl border border-dashed border-border bg-card p-8 text-center">
                  <div className="max-w-md">
                    <span className="text-4xl">{activeView === 'admin-stores' ? '🏪' : activeView === 'admin-users' ? '👥' : activeView === 'admin-activity' ? '🕘' : '📋'}</span>
                    <h2 className="mt-4 text-xl font-bold text-primary">{VIEW_TITLES[activeView]}</h2>
                    <p className="mt-2 text-sm leading-relaxed text-[var(--text-light)]">Esta sección será el siguiente paso del centro de control. Por ahora se presenta como parte de la navegación administrativa para que el alcance sea claro.</p>
                  </div>
                </div>
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
}
