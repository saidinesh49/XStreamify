const asyncHandler = (requestHandler) => {
	return async (...args) => {
		try {
			await requestHandler(...args);
		} catch (err) {
			// If it's our ApiError, use its status code, otherwise use 500
			console.log("async handler entered!", err);
			const statusCode = err?.statusCode || 500;
			const message = err?.message || "Something went wrong";

			return res.status(statusCode).json({
				success: false,
				message: message,
				// Only include stack trace in development
			});
		}
	};
};

export { asyncHandler };
