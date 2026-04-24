export function badRequest(res, message) {
    return res.status(400).json({
        success: false,
        message
    });
}
export function notFound(res, message) {
    return res.status(404).json({
        success: false,
        message
    });
}
export function serverError(res, error) {
    console.error(error);
    return res.status(500).json({
        success: false,
        message: error instanceof Error ? error.message : 'Ошибка сервера'
    });
}
export function ok(res, data) {
    return res.status(200).json({
        success: true,
        ...data
    });
}
export function created(res, data) {
    return res.status(201).json({
        success: true,
        ...data
    });
}
export function parseId(value) {
    const id = Number(value);
    return isNaN(id) ? null : id;
}
//# sourceMappingURL=controller.helpers.js.map