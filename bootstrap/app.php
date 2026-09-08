<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Symfony\Component\HttpFoundation\Response;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware): void {
        $middleware->web(append: [
            \App\Http\Middleware\HandleInertiaRequests::class,
        ]);
    })
    ->withExceptions(function (Exceptions $exceptions): void {
        $exceptions->shouldRenderJsonWhen(
            fn (Request $request) => $request->is('api/*') || $request->expectsJson(),
        );

        // 404/403/419/429/405 selalu ditampilkan lewat halaman Error bergaya
        // aplikasi (bukan cuma saat production) karena tidak butuh detail
        // debug apapun. 500/503 tetap tampil Whoops saat APP_DEBUG aktif —
        // itu masih dipakai buat men-debug bug sungguhan selama development.
        $exceptions->respond(function (Response $response, \Throwable $exception, Request $request) {
            $status = $response->getStatusCode();
            $selaluDitangani = [404, 403, 419, 429, 405];

            if ($request->is('api/*') || $request->expectsJson()) {
                return $response;
            }

            if (in_array($status, $selaluDitangani, true) || (! config('app.debug') && in_array($status, [500, 503], true))) {
                return Inertia::render('Error', ['status' => $status])
                    ->toResponse($request)
                    ->setStatusCode($status);
            }

            return $response;
        });
    })->create();
