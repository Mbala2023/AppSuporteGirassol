package ao.appsuportegirassol.services;

public class ToolContextProvider {

    private static final ThreadLocal<Long> orderIdContext = new ThreadLocal<>();

    public static void setOrderId(Long orderId) {
        orderIdContext.set(orderId);
    }

    public static Long getOrderId() {
        return orderIdContext.get();
    }

    public static void clear() {
        orderIdContext.remove();
    }
}
