package com.colander.scavenger.serverhandling;

import android.util.Pair;

import com.android.volley.Request;
import com.android.volley.RequestQueue;
import com.android.volley.Response;
import com.android.volley.VolleyError;
import com.android.volley.toolbox.JsonObjectRequest;
import com.android.volley.toolbox.StringRequest;
import com.colander.scavenger.AccountContainer;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

/**
 * Created by colander on 11/29/15.
 */
public class RequestManager {
    private String serverIP = "http://10.0.0.39:8081/";
    private String mapRequest = "MAP";
    private RequestQueue queue;

    public RequestManager(RequestQueue queue) {
        this.queue = queue;
    }

    public <T extends CallbackInterface> void getAllNodes(final T callback) {
        StringRequest stringRequest = new StringRequest(Request.Method.GET, serverIP + mapRequest,
                new Response.Listener<String>() {
                    @Override
                    public void onResponse(String response) {
                        System.out.println("GOT RESPONSE");
                        try {
                            JSONArray json = new JSONObject(response).getJSONArray("result");
                            Pair<Double, Double>[] pairs = new Pair[json.length()];
                            for (int i = 0; i < json.length(); i++) {
                                JSONObject obj = json.getJSONObject(i);
                                pairs[i] = new Pair<>(obj.getDouble("lat"), obj.getDouble("lng"));
                            }
                            callback.onPairResponse(pairs);
                        } catch (JSONException e) {
                            e.printStackTrace();
                        }
                    }
                }, new Response.ErrorListener() {
            @Override
            public void onErrorResponse(VolleyError error) {
                System.out.println("REQUEST ERRROR " + error.getMessage());

            }
        });
        queue.add(stringRequest);
    }

    public <T extends JSONCallbackInterface> void claimNode(String id, final T callback) {
        System.out.printf("SENTTTTTTTTTTTTTTTTT");
        JSONObject request = new JSONObject();
        try {
            request.put("token", AccountContainer.getAccount().getIdToken());
        } catch (JSONException e) {
            e.printStackTrace();
        }
        queue.add(new JsonObjectRequest(serverIP, request, new Response.Listener<JSONObject>() {
            @Override
            public void onResponse(JSONObject response) {
                System.out.println("SUCCESSSSSSS");
            }
        }, new Response.ErrorListener() {
            @Override
            public void onErrorResponse(VolleyError error) {
                System.out.println("REKT");
            }
        }));
    }
}
