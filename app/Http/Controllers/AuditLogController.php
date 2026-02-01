<?php

namespace App\Http\Controllers;

use App\Models\AuditLog;
use Illuminate\Support\Facades\Auth;

class AuditLogController extends Controller
{
    /**
     * Display a listing of the user's audit logs.
     */
    public function index()
    {
        try {
            $logs = AuditLog::where('user_id', Auth::id())
                ->latest()
                ->get();

            return response()->json($logs);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Failed to retrieve audit logs',
                'message' => $e->getMessage()
            ], 500);
        }
    }
}
